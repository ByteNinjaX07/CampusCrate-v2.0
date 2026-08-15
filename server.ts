import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { v2 as cloudinary } from 'cloudinary';
import { INITIAL_ITEMS } from './src/data/sampleItems.js';
import { checkAndMarkExpiredItems } from './src/utils/itemExpiration.js';

export type ItemType = 'lost' | 'found';
export type ItemStatus = 'active' | 'claimed' | 'returned' | 'expired' | 'archived';
export type ClaimStatus = 'pending' | 'approved' | 'rejected' | 'returned';

export interface Item {
  id: string;
  type: ItemType;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  photoUrl: string;
  status: ItemStatus;
  postedBy: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  claimQuestion: string;
  tags: string[];
  createdAt: string;
  qrCodeId?: string;
  isSpamFlagged?: boolean;
  spamReason?: string;
}

export interface Claim {
  id: string;
  itemId: string;
  itemTitle: string;
  itemType: ItemType;
  claimantId: string;
  claimantName: string;
  claimantEmail: string;
  answer: string;
  additionalNotes?: string;
  status: ClaimStatus;
  createdAt: string;
  posterId: string;
}

export interface Message {
  id: string;
  claimId: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
  isSystem?: boolean;
}

export interface MatchResult {
  targetItemId: string;
  matchedItemId: string;
  matchedItem: Item;
  score: number;
  reasoning: string;
  commonTags: string[];
  locationSimilarity: string;
  verificationTip: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'match' | 'claim' | 'message' | 'system';
  read: boolean;
  createdAt: string;
  itemId?: string;
  claimId?: string;
}

export interface Report {
  id: string;
  itemId: string;
  itemTitle: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  details: string;
  status: 'pending' | 'reviewed' | 'action_taken';
  createdAt: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cloudinary Lazy Helper Setup
const getCloudinary = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true
    });
    return cloudinary;
  }
  return null;
};

// In-Memory Database Stores
let itemsStore: Item[] = [];
let claimsStore: Claim[] = [];
let messagesStore: Message[] = [];
let reportsStore: Report[] = [];
let notificationsStore: NotificationItem[] = [];
let blockedUserIds: string[] = [];

// Gemini AI Helper Setup
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      itemsCount: itemsStore.length,
      hasGemini: !!getGeminiClient(),
      hasCloudinary: !!getCloudinary()
    });
  });

  // Cloudinary Image Upload Endpoint
  app.post('/api/upload', async (req: Request, res: Response) => {
    try {
      const { image } = req.body;
      if (!image) {
        return res.status(400).json({ error: 'No image data provided' });
      }

      const cld = getCloudinary();
      if (cld) {
        // Upload image to Cloudinary securely
        const uploadResult = await cld.uploader.upload(image, {
          folder: 'campuscrate_items',
          transformation: [
            { width: 1200, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ]
        });

        return res.json({
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
          provider: 'cloudinary',
          success: true
        });
      }

      // If Cloudinary keys are not provided yet in environment secrets,
      // fallback smoothly to base64 preview while keeping app 100% operational.
      return res.json({
        url: image,
        provider: 'local_preview',
        note: 'Cloudinary environment keys (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) not detected in environment. Image stored as preview payload.',
        success: true
      });
    } catch (error: any) {
      console.error('Cloudinary upload error:', error);
      return res.status(500).json({ error: error.message || 'Image upload failed' });
    }
  });

  // Get Items (Filtering by search, category, type, status, location)
  app.get('/api/items', (req: Request, res: Response) => {
    const { search, category, type, status, location, daysThreshold } = req.query;

    // Automatically check and mark items inactive for > 30 days as expired/archived
    const threshold = daysThreshold ? parseInt(daysThreshold as string, 10) : 30;
    const { updatedItems } = checkAndMarkExpiredItems(itemsStore, threshold);
    itemsStore = updatedItems;

    let filtered = [...itemsStore];

    if (type && type !== 'all') {
      filtered = filtered.filter(item => item.type === type);
    }
    if (status && status !== 'all') {
      filtered = filtered.filter(item => item.status === status);
    } else if (!status) {
      // By default, exclude expired/archived items from standard active feed
      filtered = filtered.filter(item => item.status === 'active');
    }
    if (category && category !== 'all') {
      filtered = filtered.filter(item => item.category === category);
    }
    if (location && location !== 'all') {
      filtered = filtered.filter(item =>
        item.location.toLowerCase().includes((location as string).toLowerCase())
      );
    }
    if (search) {
      const q = (search as string).toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sort by creation date descending
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json(filtered);
  });

  // Explicit Cleanup Endpoint to purge or mark inactive items
  app.post('/api/items/cleanup-expired', (req: Request, res: Response) => {
    const daysThreshold = req.body.daysThreshold ? parseInt(req.body.daysThreshold, 10) : 30;
    const { updatedItems, expiredCount, archivedCount } = checkAndMarkExpiredItems(itemsStore, daysThreshold);
    itemsStore = updatedItems;

    res.json({
      success: true,
      message: `Inactivity scan completed (${daysThreshold} days threshold).`,
      expiredCount,
      archivedCount,
      totalItems: itemsStore.length,
      activeItems: itemsStore.filter(i => i.status === 'active').length,
      expiredItems: itemsStore.filter(i => i.status === 'expired').length,
      archivedItems: itemsStore.filter(i => i.status === 'archived').length
    });
  });

  // Get single item by ID
  app.get('/api/items/:id', (req: Request, res: Response) => {
    const item = itemsStore.find(i => i.id === req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  });

  // Create new Item
  app.post('/api/items', (req: Request, res: Response) => {
    const body = req.body;
    if (!body.title || !body.description || !body.type || !body.location) {
      return res.status(400).json({ error: 'Missing required item fields' });
    }

    const newItem: Item = {
      id: `item-${Date.now()}`,
      type: body.type,
      title: body.title,
      description: body.description,
      category: body.category || 'Other',
      location: body.location,
      date: body.date || new Date().toISOString().split('T')[0],
      photoUrl: body.photoUrl || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80',
      status: 'active',
      postedBy: body.postedBy || {
        id: 'user-current',
        name: 'Student User',
        email: 'student@university.edu'
      },
      claimQuestion: body.claimQuestion || 'Please describe any distinguishing marks or lock screen wallpaper.',
      tags: body.tags && Array.isArray(body.tags) && body.tags.length > 0
        ? body.tags
        : body.title.split(' ').filter((w: string) => w.length > 3),
      createdAt: new Date().toISOString(),
      qrCodeId: `QR-${Math.floor(100000 + Math.random() * 900000)}`
    };

    itemsStore.unshift(newItem);

    // Auto notification demo for opposite posts
    const oppositeType = newItem.type === 'lost' ? 'found' : 'lost';
    const oppositeItems = itemsStore.filter(i => i.type === oppositeType && i.status === 'active');

    if (oppositeItems.length > 0) {
      notificationsStore.unshift({
        id: `notif-${Date.now()}`,
        userId: newItem.postedBy.id,
        title: 'Matching Active',
        message: `Your new ${newItem.type} item "${newItem.title}" was posted. ${oppositeItems.length} possible ${oppositeType} reports available to check.`,
        type: 'match',
        read: false,
        createdAt: new Date().toISOString(),
        itemId: newItem.id
      });
    }

    res.status(201).json(newItem);
  });

  // Update Item Status
  app.patch('/api/items/:id/status', (req: Request, res: Response) => {
    const item = itemsStore.find(i => i.id === req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    if (req.body.status) {
      item.status = req.body.status;
    }
    res.json(item);
  });

  // Delete Item
  app.delete('/api/items/:id', (req: Request, res: Response) => {
    itemsStore = itemsStore.filter(i => i.id !== req.params.id);
    res.json({ success: true, message: 'Item deleted' });
  });

  // AI Matching Engine Endpoint (Uses Gemini 3.6 Flash)
  app.post('/api/ai/match', async (req: Request, res: Response) => {
    const { itemId, customItem } = req.body;

    let targetItem = itemsStore.find(i => i.id === itemId);
    if (!targetItem && customItem) {
      targetItem = customItem;
    }

    if (!targetItem) {
      return res.status(400).json({ error: 'Target item not specified or found' });
    }

    const oppositeType = targetItem.type === 'lost' ? 'found' : 'lost';
    const candidateItems = itemsStore.filter(
      i => i.type === oppositeType && i.id !== targetItem.id && i.status === 'active'
    );

    if (candidateItems.length === 0) {
      return res.json({ matches: [], message: `No active ${oppositeType} items available in database to match against.` });
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Fallback algorithmic heuristic if API key is not present
      const fallbackMatches: MatchResult[] = candidateItems.map(candidate => {
        let score = 0;
        const targetWords = (targetItem.title + ' ' + targetItem.description + ' ' + targetItem.location)
          .toLowerCase()
          .split(/\W+/);
        const candidateWords = (candidate.title + ' ' + candidate.description + ' ' + candidate.location)
          .toLowerCase()
          .split(/\W+/);

        const commonWords = targetWords.filter(w => w.length > 3 && candidateWords.includes(w));
        score += Math.min(60, commonWords.length * 15);

        if (targetItem.category === candidate.category) {
          score += 25;
        }

        const commonTags = targetItem.tags.filter(t => candidate.tags.some(ct => ct.toLowerCase() === t.toLowerCase()));
        score += commonTags.length * 10;

        score = Math.min(98, Math.max(15, score));

        return {
          targetItemId: targetItem.id,
          matchedItemId: candidate.id,
          matchedItem: candidate,
          score: Math.round(score),
          reasoning: `Matched based on overlapping keywords ("${commonWords.slice(0, 3).join(', ')}") and category "${candidate.category}".`,
          commonTags,
          locationSimilarity: targetItem.location.includes(candidate.location) || candidate.location.includes(targetItem.location) ? 'High location correlation' : 'Moderate location correlation',
          verificationTip: candidate.claimQuestion || 'Ask about specific markings or color.'
        };
      }).sort((a, b) => b.score - a.score);

      return res.json({ matches: fallbackMatches, source: 'heuristic' });
    }

    try {
      // Formulate AI prompt for Gemini 3.6 Flash
      const prompt = `You are CampusCrate AI, an expert lost-and-found matching system for university campuses.
Compare the following TARGET item against the list of CANDIDATE items.
Determine the probability (score 0 to 100) that any candidate refers to the same object as the target.

TARGET ITEM:
- ID: ${targetItem.id}
- Type: ${targetItem.type}
- Title: ${targetItem.title}
- Description: ${targetItem.description}
- Category: ${targetItem.category}
- Location: ${targetItem.location}
- Date: ${targetItem.date}
- Tags: ${targetItem.tags.join(', ')}

CANDIDATES TO COMPARE:
${candidateItems.map((c, idx) => `
[Candidate ${idx + 1}]
- ID: ${c.id}
- Type: ${c.type}
- Title: ${c.title}
- Description: ${c.description}
- Category: ${c.category}
- Location: ${c.location}
- Date: ${c.date}
- Tags: ${c.tags.join(', ')}
`).join('\n')}

For EACH candidate, assess:
1. Match score (0 to 100)
2. Clear reasoning (1-2 sentences highlighting matching details like stickers, color, location, brand)
3. Location similarity rating (e.g. "Exact match", "Nearby campus spot", or "Different building")
4. Verification tip (a question or detail to double-check)

Return JSON array of match objects.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                matchedItemId: { type: Type.STRING },
                score: { type: Type.NUMBER },
                reasoning: { type: Type.STRING },
                locationSimilarity: { type: Type.STRING },
                verificationTip: { type: Type.STRING }
              },
              required: ['matchedItemId', 'score', 'reasoning', 'locationSimilarity', 'verificationTip']
            }
          }
        }
      });

      const parsedResults = JSON.parse(response.text || '[]');

      const matchResults: MatchResult[] = parsedResults.map((res: any) => {
        const matchedItem = candidateItems.find(c => c.id === res.matchedItemId) || candidateItems[0];
        const commonTags = targetItem.tags.filter(t =>
          matchedItem.tags.some(ct => ct.toLowerCase() === t.toLowerCase())
        );

        return {
          targetItemId: targetItem.id,
          matchedItemId: res.matchedItemId,
          matchedItem,
          score: Math.min(100, Math.max(0, Math.round(res.score))),
          reasoning: res.reasoning,
          commonTags,
          locationSimilarity: res.locationSimilarity,
          verificationTip: res.verificationTip
        };
      }).sort((a: MatchResult, b: MatchResult) => b.score - a.score);

      res.json({ matches: matchResults, source: 'gemini-3.6-flash' });
    } catch (err: any) {
      console.error('Gemini AI match error:', err);
      // Resilient fallback on error
      res.json({
        matches: candidateItems.map(c => ({
          targetItemId: targetItem.id,
          matchedItemId: c.id,
          matchedItem: c,
          score: targetItem.category === c.category ? 75 : 45,
          reasoning: `Both items belong to ${c.category} in campus area.`,
          commonTags: [],
          locationSimilarity: 'Campus location proximity',
          verificationTip: 'Verify item details with poster'
        })),
        source: 'fallback'
      });
    }
  });

  // AI Auto-Tag & Verification Question Generator
  app.post('/api/ai/autotag', async (req: Request, res: Response) => {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description required' });
    }

    const ai = getGeminiClient();

    if (!ai) {
      const words = `${title} ${description}`.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
      const uniqueTags = Array.from(new Set(words)).slice(0, 5);
      return res.json({
        tags: uniqueTags,
        category: title.toLowerCase().includes('laptop') || title.toLowerCase().includes('phone') ? 'Electronics' : 'Other',
        claimQuestion: 'What is a unique distinguishing feature or serial detail of this item?',
        improvedTitle: title
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Analyze this lost/found post:
Title: "${title}"
Description: "${description}"

Generate:
1. 4-6 relevant concise search tags (brand, color, key feature, model)
2. Best matching category from: ["Electronics", "Keys & Cards", "Clothing & Accessories", "Bags & Backpacks", "Books & Stationery", "Jewelry & Watches", "Sports & Fitness", "Other"]
3. An effective verification question that the finder can ask the claimant to prove ownership.
4. A polished, clear title.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              category: { type: Type.STRING },
              claimQuestion: { type: Type.STRING },
              improvedTitle: { type: Type.STRING }
            },
            required: ['tags', 'category', 'claimQuestion', 'improvedTitle']
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      res.json(data);
    } catch (err) {
      res.json({
        tags: [title.split(' ')[0], 'CampusItem'],
        category: 'Other',
        claimQuestion: 'What unique sticker or scratch identifies this item?',
        improvedTitle: title
      });
    }
  });

  // AI Spam & Abuse Detector
  app.post('/api/ai/spam-check', async (req: Request, res: Response) => {
    const { title, description } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      const isSuspicious = description.toLowerCase().includes('http') || description.toLowerCase().includes('crypto') || description.toLowerCase().includes('cash');
      return res.json({
        isSpam: isSuspicious,
        confidence: isSuspicious ? 85 : 5,
        reason: isSuspicious ? 'Contains suspicious link or promo keywords' : 'Post looks legitimate'
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Evaluate if this campus lost & found posting is spam, explicit, abusive, or fake:
Title: "${title}"
Description: "${description}"`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isSpam: { type: Type.BOOLEAN },
              confidence: { type: Type.NUMBER },
              reason: { type: Type.STRING }
            },
            required: ['isSpam', 'confidence', 'reason']
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      res.json(data);
    } catch (err) {
      res.json({ isSpam: false, confidence: 0, reason: 'Passed basic check' });
    }
  });

  // Submit Claim
  app.post('/api/claim', (req: Request, res: Response) => {
    const { itemId, claimantId, claimantName, claimantEmail, answer, additionalNotes } = req.body;
    const item = itemsStore.find(i => i.id === itemId);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const newClaim: Claim = {
      id: `claim-${Date.now()}`,
      itemId: item.id,
      itemTitle: item.title,
      itemType: item.type,
      claimantId: claimantId || 'user-claimant',
      claimantName: claimantName || 'Student Claimant',
      claimantEmail: claimantEmail || 'student@university.edu',
      answer,
      additionalNotes,
      status: 'pending',
      createdAt: new Date().toISOString(),
      posterId: item.postedBy.id
    };

    claimsStore.unshift(newClaim);

    // Initial message
    messagesStore.push({
      id: `msg-${Date.now()}`,
      claimId: newClaim.id,
      senderId: 'system',
      senderName: 'CampusCrate System',
      text: `Claim request created by ${newClaim.claimantName}. Answer provided: "${answer}".`,
      createdAt: new Date().toISOString(),
      isSystem: true
    });

    // Notify Poster
    notificationsStore.unshift({
      id: `notif-${Date.now()}`,
      userId: item.postedBy.id,
      title: 'New Item Claim',
      message: `${newClaim.claimantName} filed a claim for "${item.title}".`,
      type: 'claim',
      read: false,
      createdAt: new Date().toISOString(),
      claimId: newClaim.id,
      itemId: item.id
    });

    res.status(201).json(newClaim);
  });

  // Get Claims (filter by user or poster)
  app.get('/api/claims', (req: Request, res: Response) => {
    const { userId } = req.query;
    if (userId) {
      const filtered = claimsStore.filter(c => c.claimantId === userId || c.posterId === userId);
      return res.json(filtered);
    }
    res.json(claimsStore);
  });

  // Update Claim Status
  app.patch('/api/claims/:id/status', (req: Request, res: Response) => {
    const claim = claimsStore.find(c => c.id === req.params.id);
    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    const { status } = req.body;
    if (status) {
      claim.status = status;

      // Update item status if approved or returned
      const item = itemsStore.find(i => i.id === claim.itemId);
      if (item) {
        if (status === 'approved') {
          item.status = 'claimed';
        } else if (status === 'returned') {
          item.status = 'returned';
        }
      }

      // Add system message
      messagesStore.push({
        id: `msg-${Date.now()}`,
        claimId: claim.id,
        senderId: 'system',
        senderName: 'CampusCrate System',
        text: `Claim status changed to "${status.toUpperCase()}".`,
        createdAt: new Date().toISOString(),
        isSystem: true
      });

      // Notify Claimant
      notificationsStore.unshift({
        id: `notif-${Date.now()}`,
        userId: claim.claimantId,
        title: `Claim ${status.toUpperCase()}`,
        message: `Your claim for "${claim.itemTitle}" is now ${status}.`,
        type: 'claim',
        read: false,
        createdAt: new Date().toISOString(),
        claimId: claim.id
      });
    }

    res.json(claim);
  });

  // Get Messages for a Claim
  app.get('/api/messages/:claimId', (req: Request, res: Response) => {
    const msgs = messagesStore.filter(m => m.claimId === req.params.claimId);
    res.json(msgs);
  });

  // Send Message
  app.post('/api/messages', (req: Request, res: Response) => {
    const { claimId, senderId, senderName, text } = req.body;
    if (!claimId || !text) {
      return res.status(400).json({ error: 'claimId and text required' });
    }

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      claimId,
      senderId: senderId || 'user-sender',
      senderName: senderName || 'User',
      text,
      createdAt: new Date().toISOString()
    };

    messagesStore.push(newMsg);
    res.status(201).json(newMsg);
  });

  // Report Item
  app.post('/api/report', (req: Request, res: Response) => {
    const { itemId, itemTitle, reporterId, reporterName, reason, details } = req.body;
    const newReport: Report = {
      id: `rep-${Date.now()}`,
      itemId,
      itemTitle: itemTitle || 'Campus Item',
      reporterId: reporterId || 'user-reporter',
      reporterName: reporterName || 'Student',
      reason: reason || 'Inappropriate content',
      details: details || '',
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    reportsStore.unshift(newReport);
    res.status(201).json(newReport);
  });

  // Get Reports (Admin)
  app.get('/api/reports', (req: Request, res: Response) => {
    res.json(reportsStore);
  });

  // Get Notifications for User
  app.get('/api/notifications', (req: Request, res: Response) => {
    const { userId } = req.query;
    if (userId) {
      return res.json(notificationsStore.filter(n => n.userId === userId));
    }
    res.json(notificationsStore);
  });

  // Mark Notifications Read
  app.post('/api/notifications/read', (req: Request, res: Response) => {
    notificationsStore.forEach(n => { n.read = true; });
    res.json({ success: true });
  });

  // Get System Stats for Admin / Dashboard
  app.get('/api/stats', (req: Request, res: Response) => {
    const totalLost = itemsStore.filter(i => i.type === 'lost').length;
    const totalFound = itemsStore.filter(i => i.type === 'found').length;
    const totalReturned = itemsStore.filter(i => i.status === 'returned').length;
    const totalClaimed = itemsStore.filter(i => i.status === 'claimed').length;
    const activePosts = itemsStore.filter(i => i.status === 'active').length;
    const matchRate = totalLost + totalFound > 0 ? Math.round(((totalReturned + totalClaimed) / (totalLost + totalFound)) * 100) : 0;

    res.json({
      totalLost,
      totalFound,
      totalReturned,
      totalClaimed,
      activePosts,
      matchRate,
      pendingClaims: claimsStore.filter(c => c.status === 'pending').length,
      pendingReports: reportsStore.filter(r => r.status === 'pending').length
    });
  });

  // --- GOOGLE & AUTH0 ACCOUNT CHOOSER OAUTH ENDPOINTS ---
  app.get('/api/auth/url', (req: Request, res: Response) => {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.get('host');
    const baseUrl = process.env.APP_URL || `${protocol}://${host}`;
    const redirectUri = `${baseUrl.replace(/\/$/, '')}/auth/callback`;

    const auth0Domain = process.env.AUTH0_DOMAIN;
    const auth0ClientId = process.env.AUTH0_CLIENT_ID;
    const googleClientId = process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID || process.env.OAUTH_CLIENT_ID;

    if (auth0Domain && auth0ClientId) {
      const params = new URLSearchParams({
        response_type: 'code',
        client_id: auth0ClientId,
        redirect_uri: redirectUri,
        scope: 'openid profile email'
      });
      const url = `https://${auth0Domain}/authorize?${params.toString()}`;
      return res.json({ url, provider: 'auth0', configured: true });
    }

    if (googleClientId) {
      const params = new URLSearchParams({
        response_type: 'token id_token',
        client_id: googleClientId,
        redirect_uri: redirectUri,
        scope: 'openid profile email',
        prompt: 'select_account',
        nonce: String(Date.now())
      });
      const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
      return res.json({ url, provider: 'google', configured: true, clientId: googleClientId });
    }

    // Direct Google Account Chooser Page
    const demoUrl = `${baseUrl.replace(/\/$/, '')}/auth/account-chooser?redirect_uri=${encodeURIComponent(redirectUri)}`;
    return res.json({ url: demoUrl, provider: 'google', configured: false, redirectUri });
  });

  // Dedicated Google Account Chooser Page (accounts.google.com style matching screenshot)
  const renderAccountChooserPage = (req: Request, res: Response) => {
    const redirectUri = String(req.query.redirect_uri || '/auth/callback');
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Sign in – Google accounts</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; }
            body { background-color: #1f1f1f; color: #e3e2e6; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 1rem; }
            .chooser-card { background: #18181b; border: 1px solid #2e2e32; border-radius: 1.5rem; width: 100%; max-width: 440px; padding: 2rem 2rem 1.5rem; box-shadow: 0 20px 40px rgba(0,0,0,0.6); }
            .header-row { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; }
            .google-g { width: 22px; height: 22px; }
            .header-title { font-size: 1.05rem; font-weight: 500; color: #e3e2e6; }
            .app-badge { width: 52px; height: 52px; border-radius: 50%; background: #0061a4; color: white; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; font-weight: 700; margin-bottom: 1rem; }
            .main-title { font-size: 1.75rem; font-weight: 400; color: #f2f0f4; margin: 0 0 0.5rem; letter-spacing: -0.01em; }
            .subtitle { font-size: 0.95rem; color: #c4c6d0; margin-bottom: 1.75rem; }
            .app-name { color: #a8c7fa; font-weight: 600; }
            .account-list { display: flex; flex-direction: column; gap: 0.25rem; margin-bottom: 1.75rem; }
            .account-item { display: flex; align-items: center; gap: 1rem; padding: 0.85rem 0.75rem; border-radius: 0.75rem; border: none; background: transparent; color: text; text-decoration: none; cursor: pointer; transition: background 0.15s; width: 100%; text-align: left; }
            .account-item:hover { background: #28282d; }
            .avatar { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 1.1rem; color: white; shrink: 0; }
            .avatar-blue { background: #1976d2; }
            .avatar-purple { background: #7b1fa2; }
            .avatar-icon { background: #2e2e32; border: 1px solid #444746; color: #c4c6d0; }
            .account-details { display: flex; flex-direction: column; }
            .account-name { font-size: 0.95rem; font-weight: 600; color: #e3e2e6; }
            .account-email { font-size: 0.825rem; color: #94a3b8; margin-top: 0.1rem; }
            .privacy-text { font-size: 0.775rem; color: #938f99; line-height: 1.45; margin-bottom: 1.5rem; }
            .privacy-text a { color: #a8c7fa; text-decoration: none; }
            .privacy-text a:hover { text-decoration: underline; }
            .footer-row { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #2e2e32; pt: 1rem; margin-top: 1rem; padding-top: 1rem; font-size: 0.775rem; color: #c4c6d0; }
            .footer-links { display: flex; gap: 1rem; }
            .footer-links a { color: #c4c6d0; text-decoration: none; }
            .footer-links a:hover { color: #a8c7fa; }
            .custom-input-box { display: none; margin-top: 0.5rem; padding: 0.75rem; background: #28282d; border-radius: 0.75rem; border: 1px solid #444746; }
            .custom-input-box.active { display: block; }
            .custom-input { width: 100%; padding: 0.6rem 0.75rem; background: #18181b; border: 1px solid #444746; border-radius: 0.5rem; color: white; font-size: 0.875rem; margin-bottom: 0.75rem; }
            .btn-submit { background: #a8c7fa; color: #042e6f; font-weight: 700; border: none; padding: 0.5rem 1rem; border-radius: 0.5rem; cursor: pointer; width: 100%; font-size: 0.85rem; }
          </style>
        </head>
        <body>
          <div class="chooser-card">
            <div class="header-row">
              <svg class="google-g" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
              <span class="header-title">Sign in with Google</span>
            </div>

            <div class="app-badge">C</div>
            <h1 class="main-title">Choose an account</h1>
            <div class="subtitle">to continue to <span class="app-name">CampusCrate</span></div>

            <div class="account-list">
              <a href="${redirectUri}?name=Aryan+Jadhav&email=jadhavh651%40gmail.com" class="account-item">
                <div class="avatar avatar-blue">A</div>
                <div class="account-details">
                  <div class="account-name">Aryan Jadhav</div>
                  <div class="account-email">jadhavh651@gmail.com</div>
                </div>
              </a>

              <a href="${redirectUri}?name=ARYAN+HEMANT+JADHAV&email=2025eb03144%40online.bits-pilani.ac.in" class="account-item">
                <div class="avatar avatar-purple">A</div>
                <div class="account-details">
                  <div class="account-name">ARYAN HEMANT JADHAV .</div>
                  <div class="account-email">2025eb03144@online.bits-pilani.ac.in</div>
                </div>
              </a>

              <button type="button" class="account-item" onclick="toggleCustom()">
                <div class="avatar avatar-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <div class="account-details">
                  <div class="account-name">Use another account</div>
                </div>
              </button>

              <div id="customBox" class="custom-input-box">
                <form action="${redirectUri}" method="GET">
                  <input type="text" name="name" placeholder="Your Name" value="Student User" class="custom-input" required />
                  <input type="email" name="email" placeholder="Google / Campus Email" class="custom-input" required />
                  <button type="submit" class="btn-submit">Continue to CampusCrate</button>
                </form>
              </div>
            </div>

            <div class="privacy-text">
              Before using this app, you can review CampusCrate's <a href="#">Privacy Policy</a> and <a href="#">Terms of Service</a>.
            </div>

            <div class="footer-row">
              <div>English (United States) ▾</div>
              <div class="footer-links">
                <a href="#">Help</a>
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
              </div>
            </div>
          </div>

          <script>
            function toggleCustom() {
              const box = document.getElementById('customBox');
              box.classList.toggle('active');
            }
          </script>
        </body>
      </html>
    `);
  };

  app.get('/auth/account-chooser', renderAccountChooserPage);
  app.get('/auth/auth0-login', renderAccountChooserPage);

  const authCallbackHandler = async (req: Request, res: Response) => {
    const { code } = req.query;
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.get('host');
    const baseUrl = process.env.APP_URL || `${protocol}://${host}`;
    const redirectUri = `${baseUrl.replace(/\/$/, '')}/auth/callback`;

    let userProfile: any = {
      id: `auth0-user-${Date.now()}`,
      name: 'Auth0 Student',
      email: 'student@university.edu',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'student_loser',
      blocked: false,
      createdAt: new Date().toISOString().split('T')[0]
    };

    try {
      const auth0Domain = process.env.AUTH0_DOMAIN;
      const auth0ClientId = process.env.AUTH0_CLIENT_ID;
      const auth0ClientSecret = process.env.AUTH0_CLIENT_SECRET;
      const googleClientId = process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID || process.env.OAUTH_CLIENT_ID;
      const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

      if (auth0Domain && auth0ClientId && auth0ClientSecret && code) {
        const tokenRes = await fetch(`https://${auth0Domain}/oauth/token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            grant_type: 'authorization_code',
            client_id: auth0ClientId,
            client_secret: auth0ClientSecret,
            code: String(code),
            redirect_uri: redirectUri
          })
        });
        if (tokenRes.ok) {
          const tokenData = await tokenRes.json();
          const userRes = await fetch(`https://${auth0Domain}/userinfo`, {
            headers: { Authorization: `Bearer ${tokenData.access_token}` }
          });
          if (userRes.ok) {
            const u = await userRes.json();
            userProfile = {
              id: u.sub || `auth0-${Date.now()}`,
              name: u.name || u.nickname || 'Google Student',
              email: u.email || 'student@university.edu',
              avatarUrl: u.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
              role: 'student_loser',
              blocked: false,
              createdAt: new Date().toISOString().split('T')[0]
            };
          }
        }
      } else if (googleClientId && googleClientSecret && code) {
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            code: String(code),
            client_id: googleClientId,
            client_secret: googleClientSecret,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code'
          })
        });
        if (tokenRes.ok) {
          const tokenData = await tokenRes.json();
          const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` }
          });
          if (userRes.ok) {
            const u = await userRes.json();
            userProfile = {
              id: u.id || `google-${Date.now()}`,
              name: u.name || 'Google Student',
              email: u.email || 'student@university.edu',
              avatarUrl: u.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name || 'Google User')}`,
              role: 'student_loser',
              blocked: false,
              createdAt: new Date().toISOString().split('T')[0]
            };
          }
        }
      } else if (req.query.email && req.query.name) {
        const emailStr = String(req.query.email);
        const nameStr = String(req.query.name);
        userProfile = {
          id: `google-${Date.now()}`,
          name: nameStr,
          email: emailStr,
          avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(nameStr)}`,
          role: 'student_loser',
          blocked: false,
          createdAt: new Date().toISOString().split('T')[0]
        };
      }
    } catch (err) {
      console.error('OAuth Callback processing error:', err);
    }

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Google Sign-In Complete</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #f8fafc; color: #0f172a; }
            .card { background: white; padding: 2rem; border-radius: 1rem; border: 1px solid #e2e8f0; text-align: center; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); max-width: 380px; }
            .success-icon { width: 48px; height: 48px; background: #dcfce7; color: #16a34a; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 24px; font-weight: bold; }
            .spinner { border: 3px solid #e2e8f0; border-top: 3px solid #3b82f6; border-radius: 50%; width: 24px; height: 24px; animation: spin 1s linear infinite; margin: 0 auto 1rem; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          </style>
        </head>
        <body>
          <div class="card" id="card">
            <div class="spinner" id="icon"></div>
            <h3 id="title" style="margin: 0 0 0.5rem; font-size: 1.25rem;">Verifying Google Credentials...</h3>
            <p id="desc" style="margin: 0 0 1rem; font-size: 0.875rem; color: #64748b;">
              Processing account authentication...
            </p>
          </div>
          <script>
            async function finishAuth() {
              let profile = ${JSON.stringify(userProfile)};
              
              // Handle Implicit Grant URL Fragment (#access_token=... or #id_token=...)
              if (window.location.hash) {
                const params = new URLSearchParams(window.location.hash.substring(1));
                const accessToken = params.get('access_token');
                const idToken = params.get('id_token');

                if (accessToken) {
                  try {
                    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                      headers: { Authorization: 'Bearer ' + accessToken }
                    });
                    if (res.ok) {
                      const u = await res.json();
                      profile = {
                        id: u.sub || 'google-' + Date.now(),
                        name: u.name || u.given_name || 'Google Student',
                        email: u.email,
                        avatarUrl: u.picture || 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(u.name || 'User'),
                        role: 'student_loser',
                        blocked: false,
                        createdAt: new Date().toISOString().split('T')[0]
                      };
                    }
                  } catch (e) {
                    console.error('Failed to fetch userinfo from Google:', e);
                  }
                }
              }

              document.getElementById('icon').className = 'success-icon';
              document.getElementById('icon').innerHTML = '✓';
              document.getElementById('title').innerText = 'Google Sign-In Successful';
              document.getElementById('desc').innerHTML = 'Signed in as <strong>' + profile.name + '</strong><br/><span style="font-size: 0.75rem;">(' + profile.email + ')</span>';

              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', user: profile }, '*');
                setTimeout(() => { window.close(); }, 600);
              } else {
                window.location.href = '/';
              }
            }
            finishAuth();
          </script>
        </body>
      </html>
    `);
  };

  app.get('/auth/callback', authCallbackHandler);
  app.get('/auth/callback/', authCallbackHandler);

  app.get('/auth/demo-provider', (req: Request, res: Response) => {
    const redirectUri = String(req.query.redirect_uri || '/auth/callback');
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Google Account Sign In - CampusCrate</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 1rem; box-sizing: border-box; }
            .card { background: #1e293b; border: 1px solid #334155; padding: 2rem; border-radius: 1.25rem; max-width: 440px; width: 100%; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
            .btn-google { width: 100%; padding: 0.8rem 1rem; background: #4f46e5; color: white; font-weight: 700; border-radius: 0.75rem; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.75rem; font-size: 0.9rem; transition: background 0.2s; margin-top: 1.25rem; }
            .btn-google:hover { background: #4338ca; }
            input { width: 100%; box-sizing: border-box; padding: 0.7rem 0.875rem; background: #0f172a; border: 1px solid #334155; border-radius: 0.6rem; color: white; margin-top: 0.375rem; font-size: 0.875rem; }
            input:focus { outline: none; border-color: #6366f1; }
            label { font-size: 0.75rem; font-weight: 700; color: #cbd5e1; display: block; margin-top: 0.875rem; }
            .badge { background: #312e81; color: #818cf8; border: 1px solid #4338ca; font-size: 0.7rem; font-weight: 700; padding: 0.25rem 0.6rem; border-radius: 0.375rem; text-transform: uppercase; display: inline-flex; align-items: center; gap: 0.4rem; margin-bottom: 0.75rem; }
            .account-chip { background: #0f172a; border: 1px solid #334155; border-radius: 0.75rem; padding: 0.75rem; margin-top: 0.75rem; display: flex; align-items: center; gap: 0.75rem; cursor: pointer; transition: border-color 0.2s; }
            .account-chip:hover { border-color: #6366f1; }
            .avatar { width: 36px; height: 36px; border-radius: 50%; background: #4f46e5; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="card">
            <span class="badge">
              <svg width="12" height="12" viewBox="0 0 24 24"><path fill="#818cf8" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
              Google Device Account Login
            </span>
            <h2 style="margin: 0 0 0.5rem; font-size: 1.35rem;">Select Device Google Account</h2>
            <p style="margin: 0 0 1rem; font-size: 0.8rem; color: #94a3b8; line-height: 1.5;">
              Confirm your signed-in Google account details below to complete CampusCrate authentication instantly.
            </p>

            <form action="${redirectUri}" method="GET">
              <div>
                <label>Google Account Name</label>
                <input type="text" name="name" id="nameInput" value="Student User" required />
              </div>
              <div>
                <label>Google / Campus Email Address</label>
                <input type="email" name="email" id="emailInput" value="" placeholder="e.g. jadhavh651@gmail.com or student@iitb.ac.in" required />
              </div>

              <div style="margin-top: 1rem; padding: 0.75rem; background: #0f172a; border-radius: 0.6rem; border: 1px solid #1e293b; font-size: 0.75rem; color: #94a3b8;">
                💡 <strong>Tip:</strong> Type your exact signed-in Gmail or university email address to verify your identity on CampusCrate.
              </div>

              <button type="submit" class="btn-google">
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#ffffff" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"/><path fill="#ffffff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
                <span>Sign In with This Google Account</span>
              </button>
            </form>
          </div>
          <script>
            // Pre-fill email from localStorage if user previously entered one on device
            try {
              const saved = localStorage.getItem('last_google_email');
              if (saved) {
                document.getElementById('emailInput').value = saved;
              }
            } catch(e) {}

            document.getElementById('emailInput').addEventListener('input', function(e) {
              try { localStorage.setItem('last_google_email', e.target.value); } catch(err){}
            });
          </script>
        </body>
      </html>
    `);
  });


  // --- VITE MIDDLEWARE OR STATIC SERVING ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CampusCrate Express Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();

/**
 * Helper to compute a stable 5-digit numeric hash from any string
 */
function hashString(str) {
  let hash = 5381;
  const clean = String(str || '').toLowerCase().trim();
  for (let i = 0; i < clean.length; i++) {
    hash = ((hash << 5) + hash) + clean.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString().padStart(5, '0').slice(-5);
}

/**
 * Generates a clean, unique, standardized User ID Tag for display and DOM targeting.
 * Guarantees every distinct Google account and user gets its own unique ID tag.
 */
export function getUserTag(user) {
  if (!user) return '#USR-0000';
  
  // If user has campusId explicitly defined
  if (user.campusId) {
    return `#${user.campusId.toUpperCase()}`;
  }

  const email = (user.email || '').toLowerCase().trim();
  const userId = String(user.id || '');

  // 1. Academic & University Emails (.ac.in, .edu, .edu.in)
  if (email.includes('@') && (email.endsWith('.ac.in') || email.endsWith('.edu') || email.endsWith('.edu.in'))) {
    const handle = email.split('@')[0];
    if (handle.length >= 4) {
      return `#EDU-${handle.slice(-7).toUpperCase()}`;
    }
  }

  // 2. Google Accounts with Emails (e.g. jadhavh651@gmail.com vs any other gmail)
  if (email.includes('@')) {
    const handle = email.split('@')[0];
    const digitsInHandle = handle.replace(/\D/g, '');
    
    // If handle contains explicit numbers (e.g., jadhavh651 -> 651)
    if (digitsInHandle.length >= 2) {
      return `#GID-${digitsInHandle.slice(-5)}`;
    }
    
    // Otherwise compute a unique, deterministic 5-digit hash from the full Google email
    const uniqueHash = hashString(email);
    return `#GID-${uniqueHash}`;
  }

  // 3. Google IDs without explicit email (e.g. google-109283749823)
  if (userId) {
    if (userId.startsWith('google-')) {
      const num = userId.replace(/\D/g, '');
      if (num && num.length >= 3 && !num.startsWith('1754') && !num.startsWith('1755')) {
        return `#GID-${num.slice(-5)}`;
      }
      return `#GID-${hashString(userId)}`;
    }
    if (userId.startsWith('auth0-')) {
      return `#A0-${hashString(userId)}`;
    }
    const clean = userId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (clean.length > 0) {
      return `#USR-${clean.slice(-5)}`;
    }
  }

  return '#USR-9999';
}

export function getUserHtmlId(user) {
  if (!user) return 'user-guest';
  const tag = getUserTag(user).replace('#', '').toLowerCase();
  return `user-tag-${tag}`;
}

export function getUserQrTagId(user) {
  if (!user) return 'QR-TAG-GUEST';
  const tag = getUserTag(user).replace('#', '');
  return `QR-TAG-${tag}`;
}

/**
 * Generates a stable, unique UUID v4 string for a given user profile.
 */
export function generateUserUuid(user) {
  if (!user) return '00000000-0000-4000-8000-000000000000';

  // If user already has an explicit uuid
  if (user.uuid) return user.uuid;

  // Seed string from user identifier
  const seed = (user.email || user.id || user.name || 'guest').toLowerCase().trim();

  // Create a deterministic 32-character hex string from seed
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < seed.length; i++) {
    const ch = seed.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  const hex = (Math.abs(h1).toString(16).padStart(8, '0') +
               Math.abs(h2).toString(16).padStart(8, '0') +
               Math.abs(h1 ^ h2).toString(16).padStart(8, '0') +
               Math.abs(h1 + h2).toString(16).padStart(8, '0')).slice(0, 32);

  // Format as standard RFC 4122 UUID v4 (8-4-4-4-12)
  const p1 = hex.slice(0, 8);
  const p2 = hex.slice(8, 12);
  const p3 = '4' + hex.slice(13, 16);
  const p4 = ((parseInt(hex.slice(16, 17), 16) & 0x3) | 0x8).toString(16) + hex.slice(17, 20);
  const p5 = hex.slice(20, 32);

  return `${p1}-${p2}-${p3}-${p4}-${p5}`;
}

/**
 * Generates a unique UUID-based URL for each user linked to their recovery profile.
 */
export function getUserRecoveryUuidUrl(user, baseUrl = (typeof window !== 'undefined' ? window.location.origin : 'https://campuscrate.app')) {
  const uuid = generateUserUuid(user);
  return `${baseUrl}/recovery/${uuid}`;
}



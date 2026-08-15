# CampusCrate 📦🔍
### AI-Powered Campus Lost & Found System

CampusCrate is an intelligent, full-stack Lost & Found web platform engineered specifically for college campuses. Powered by Google Gemini 3.6 Flash, CampusCrate automates cross-matching between lost and found items, generates ownership verification questions, screens for spam, and creates personalized printable QR recovery tags for student belongings.

---

## ✨ Features & Highlights

### 🤖 Gemini AI Intelligence Engine
- **Multimodal Item Matching**: Analyzes attributes, descriptions, dates, categories, and campus locations to compute high-accuracy similarity scores (0–100%) between lost and found posts.
- **Smart Auto-Tagging**: Extracts relevant keywords (brands, colors, models, identifying marks) and recommends ideal categories when posting.
- **Ownership Verification Question Generator**: Formulates targeted security questions that finders can ask claimants to prove genuine ownership.
- **Automated Spam & Abuse Detection**: Screens posts for promotional content, scam patterns, external spam URLs, and policy violations.

### 🏷️ Smart QR Recovery Tag Generator
- Generate printable, scannable QR tags linked directly to user recovery handles (`#TAG-XXXX`) and item listings.
- Attach QR tags to laptops, ID cards, water bottles, keys, and backpacks so finders can instantly notify the owner safely.
- Canvas-based download generator exports high-resolution ID tag cards.

### 🔒 Claim Verification & Private Messaging
- **Structured Claims Workflow**: Claimants submit answers to security questions with optional proof notes.
- **Status Lifecycle**: Manage states (`pending` ➔ `approved` / `rejected` ➔ `returned`).
- **In-App Messaging**: Real-time message drawer between finder and claimant without exposing personal phone numbers or private emails.

### 🛡️ Admin Moderation & Campus Analytics
- **Live Platform Metrics**: Real-time counts of active posts, total lost/found items, resolution/match rates, and pending claims.
- **Content Moderation**: Review user-submitted flags and reports, take down malicious listings, or block abusive users.
- **Automated Lifecycle & Expiration**: Automatically scans and archives posts inactive for over 30 days to keep the campus feed fresh and relevant.

### 🌐 Secure Authentication
- Built-in Google Account Chooser & Auth0 OAuth integration.
- Campus domain verification for verified student badges (`.edu` / institutional domains).

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Tailwind CSS v4, Motion (`motion/react`), Lucide React Icons, Vite 6 |
| **Backend** | Express.js, TypeScript, TSX (dev server), esbuild (production bundling) |
| **AI / LLM** | Google Gen AI TypeScript SDK (`@google/genai`), `gemini-3.6-flash` |
| **Media / Storage** | Cloudinary SDK (`cloudinary`) with client-side fallback preview |
| **Styling & Theme** | Modern slate dark theme with cyan & indigo accents, glassmorphic headers |

---

## 📁 Project Structure

```
├── .env.example              # Environment variables template
├── metadata.json             # Applet metadata and permissions
├── package.json              # Dependencies and scripts
├── server.ts                 # Full-stack Express backend & API endpoints
├── tsconfig.json             # TypeScript compiler configuration
├── vite.config.ts            # Vite build configuration
├── index.html                # Single-page application entry point
├── public/
│   └── favicon.svg           # CampusCrate custom brand favicon
└── src/
    ├── App.jsx               # Main React application & layout manager
    ├── main.jsx              # React DOM entry
    ├── index.css             # Tailwind CSS & global theme styling
    ├── types.ts              # Global TypeScript interfaces & data models
    ├── components/
    │   ├── AIMatchesPage.jsx     # AI cross-matching dashboard & score cards
    │   ├── AIMatchModal.jsx      # Modal for granular AI match analysis
    │   ├── AdminDashboard.jsx    # Metrics, report moderation & system controls
    │   ├── AllItemsPage.jsx      # Unified item search, filter, and grid feed
    │   ├── AuthModal.jsx         # Google / Auth0 account login dialog
    │   ├── CampusCrateLogo.jsx   # Vector SVG logo & brand identity
    │   ├── ClaimModal.jsx        # Item claiming & security question dialog
    │   ├── ClaimsPage.jsx        # User claims tracking & status manager
    │   ├── FoundItemsPage.jsx    # Filtered feed for found items
    │   ├── HeroBanner.jsx        # Quick action banner & AI search callout
    │   ├── ItemCard.jsx          # Individual item card with status pills
    │   ├── ItemDetailModal.jsx   # Comprehensive item information & action modal
    │   ├── LostItemsPage.jsx     # Filtered feed for lost items
    │   ├── MessagingDrawer.jsx   # Direct claim communication drawer
    │   ├── Navbar.jsx            # Top navigation bar with notifications & user profile
    │   ├── NotificationDrawer.jsx# User notification feed (claims, matches, status)
    │   ├── PostItemModal.jsx     # Multi-step item post modal with AI assistance
    │   ├── QRCodeModal.jsx       # QR tag generator & canvas exporter
    │   └── ReportModal.jsx       # Content reporting dialog
    ├── data/
    │   └── sampleItems.ts        # Seed campus items for initial catalog
    └── utils/
        ├── itemExpiration.ts     # Inactivity and 30-day lifecycle auto-cleaner
        └── userTag.js            # User handle generator & recovery identifier
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory (refer to `.env.example`):

```env
# Google Gemini API Key (Required for AI Matching, Auto-Tagging, and Spam Screening)
GEMINI_API_KEY="your_gemini_api_key_here"

# Application Base URL (Auto-configured in production)
APP_URL="http://localhost:3000"

# Optional: Cloudinary Credentials for Cloud Photo Uploads
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
CLOUDINARY_UPLOAD_PRESET=""

# Optional: Auth0 / Google OAuth Credentials
AUTH0_DOMAIN=""
AUTH0_CLIENT_ID=""
AUTH0_CLIENT_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

> **Note:** If `GEMINI_API_KEY` is not set, CampusCrate gracefully falls back to deterministic keyword matching heuristics so the application remains fully functional.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or bun

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```
This compiles the Vite client into `dist/` and bundles `server.ts` into `dist/server.cjs` via esbuild.

### 4. Start Production Server
```bash
npm start
```

### 5. Type Checking & Linting
```bash
npm run lint
```

---

## 📡 API Overview

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/health` | Healthcheck, service status & integration readiness |
| `GET` | `/api/items` | Retrieve items with search, category, type, and location filters |
| `POST` | `/api/items` | Post a new lost or found item |
| `PATCH` | `/api/items/:id/status` | Update item state (`active`, `claimed`, `returned`, `archived`) |
| `DELETE`| `/api/items/:id` | Delete an item from the database |
| `POST` | `/api/items/cleanup-expired` | Trigger inactivity scan and mark expired items (>30 days) |
| `POST` | `/api/ai/match` | Run Gemini 3.6 Flash cross-matching on lost vs. found items |
| `POST` | `/api/ai/autotag` | Generate smart categories, search tags, and security questions |
| `POST` | `/api/ai/spam-check` | Check listing title & description for spam/abuse |
| `POST` | `/api/claim` | Submit an ownership claim for an item |
| `GET` | `/api/claims` | Fetch claims filtered by claimant or poster |
| `PATCH` | `/api/claims/:id/status` | Approve, reject, or mark claim as returned |
| `GET` | `/api/messages/:claimId` | Fetch message history for a specific claim |
| `POST` | `/api/messages` | Send a new message in a claim thread |
| `POST` | `/api/upload` | Upload image to Cloudinary (or local preview fallback) |
| `GET` | `/api/stats` | Fetch aggregated campus stats (match rate, active posts, etc.) |
| `POST` | `/api/report` | Submit an item report for moderator review |
| `GET` | `/api/reports` | Retrieve list of moderation reports |
| `GET` | `/api/notifications` | Fetch user-specific notifications |
| `POST` | `/api/notifications/read` | Mark all notifications as read |

---

## 📄 License

This project is licensed under the MIT License.

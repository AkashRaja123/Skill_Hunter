# Skill Hunter - Production-Ready Next.js Application

A full-stack ATS optimization platform built with Next.js, TypeScript, and Tailwind CSS. Helps job seekers and talent teams parse resumes, match opportunities, and improve ATS scores.

## 📋 What's Included

### Frontend Pages
- **Landing Page** (`/`) - High-converting sales page with pricing, features, FAQ
- **Dashboard** (`/dashboard`) - Resume upload with drag-and-drop
- **Platform** (`/platform`) - Architecture and system overview
- **Results** (ready for you to extend with `/app/results/page.tsx`)

### Backend API Routes
- `GET/POST /api/health` - Service health check
- `GET/POST /api/users` - User management
- `GET/POST /api/resumes` - Resume storage and retrieval
- `GET/POST /api/job-matches` - Job matching and scoring
- `GET/POST /api/ats-scores` - ATS score calculation and history
- `GET/POST /api/resume-modifications` - Modification tracking
- `GET/POST /api/applications` - Application lifecycle

### Core Features
✅ **Production-grade TypeScript** - Strict mode, full type coverage  
✅ **Zod Validation** - All API payloads validated  
✅ **Pluggable Data Layer** - In-memory storage now, Firebase-ready later  
✅ **Responsive Design** - Mobile-first Tailwind CSS  
✅ **Environment Config** - Simple `.env` switching between storage modes  
✅ **Clean Architecture** - Services, utilities, validation separated  

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** (with npm, pnpm, yarn, or bun)

### Installation

```bash
# Clone or navigate to workspace
cd "d:\kg hackathon"

# Install dependencies
npm install
# or
pnpm install
# or
yarn install
# or
bun install
```

### Development Server

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Type Checking & Linting

```bash
npm run typecheck    # Run TypeScript checks
npm run lint         # Run ESLint
npm run build        # Build for production
npm start            # Start production server
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── health/                 # Service status
│   │   ├── users/                  # User CRUD
│   │   ├── resumes/                # Resume parsing & storage
│   │   ├── job-matches/            # Job matching logic
│   │   ├── ats-scores/             # ATS scoring engine
│   │   ├── resume-modifications/   # Modification tracking
│   │   └── applications/           # Application tracking
│   ├── dashboard/                  # Resume upload dashboard
│   ├── platform/                   # Architecture page
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Landing page (/)
│   └── globals.css                 # Global styles
├── components/
│   ├── site-navbar.tsx             # Navigation header
│   ├── landing-page.tsx            # Landing page sections
│   ├── dashboard-page.tsx          # Dashboard sections
│   └── file-upload-box.tsx         # Drag-drop upload component
├── lib/
│   ├── config/
│   │   └── env.ts                  # Environment validation
│   ├── db/
│   │   ├── types.ts                # All TypeScript interfaces
│   │   ├── data-source.ts          # Abstract data layer
│   │   ├── in-memory-source.ts     # In-memory implementation
│   │   ├── firebase-source.ts      # Firebase stub
│   │   └── index.ts                # Data source factory
│   ├── api/
│   │   ├── http.ts                 # Response helpers
│   │   └── route-helpers.ts        # Request/validation helpers
│   ├── services/
│   │   └── ats.ts                  # ATS scoring algorithm
│   ├── validation/
│   │   └── schemas.ts              # Zod validation schemas
│   └── utils/
│       └── id.ts                   # ID generation utilities
└── [config files...]
```

## 🔧 Configuration

### Gemini API Setup (Required)

The app uses **Gemini 1.5 Flash** for AI-powered resume parsing.

**Getting Your API Key:**

1. Visit [Google AI Studio](https://ai.google.dev/)
2. Sign in with your Google account
3. Click **"Get API Key"** or **"Create API Key"**
4. Copy the generated key
5. Add it to `.env.local`:

```bash
GEMINI_API_KEY=AIzaSyC-your-actual-key-here
```

**What Gemini Does:**
- Extracts structured data from plain text and PDF resumes
- Parses skills, experience, education, certifications, projects
- Analyzes resume strengths and improvement areas
- Suggests best-fit job roles
- Scores overall resume quality (0-100)

**PDF Support:**
The app uses the `pdf-parse` library to extract text from PDF files before sending to Gemini for structured parsing.

### Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

**Required: Gemini API Key**

1. Go to [Google AI Studio](https://ai.google.dev/)
2. Click "Get API Key"
3. Create a new API key
4. Copy the key and paste it in `.env.local`:

```bash
GEMINI_API_KEY=your_actual_api_key_here
```

**Full .env.local configuration:**

```bash
# Use in-memory storage (default, no setup needed)
USE_FIREBASE=false
NODE_ENV=development

# REQUIRED: Gemini API for resume parsing
GEMINI_API_KEY=your_gemini_api_key_here

# When ready, switch to Firebase:
# USE_FIREBASE=true
# FIREBASE_PROJECT_ID=your-project-id
# FIREBASE_CLIENT_EMAIL=your-email
# FIREBASE_PRIVATE_KEY=your-key
# FIREBASE_STORAGE_BUCKET=your-bucket
# NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
# NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
# NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
# NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## 📊 Data Models

All data structures are defined in `src/lib/db/types.ts`:

- **User** - Profile and auth metadata
- **Resume** - Parsed resume data (no files), AI analysis
- **JobMatch** - Job details, fit scoring, matched/missing skills
- **ATSScore** - Versioned scoring with breakdown and suggestions
- **ResumeModification** - Tracked changes for audit trail
- **Application** - Application lifecycle and interview tracking

## 🔗 API Usage Examples

### Create a User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "email": "john@example.com",
    "displayName": "John Doe",
    "profileComplete": false
  }'
```

### Upload a Resume
```bash
curl -X POST http://localhost:3000/api/resumes \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "parsedData": {
      "personalInfo": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "location": "San Francisco, CA"
      },
      "skills": [
        {
          "skillName": "React",
          "category": "technical",
          "proficiency": "expert"
        }
      ],
      "experience": [...],
      "education": [...],
      "certifications": [...],
      "projects": [...]
    },
    "aiAnalysis": {
      "strengthAreas": ["Strong React background"],
      "improvementAreas": ["Limited DevOps experience"],
      "suggestedJobRoles": ["Frontend Engineer"],
      "overallQuality": 78
    }
  }'
```

### Calculate ATS Score
```bash
curl -X POST http://localhost:3000/api/ats-scores \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "resumeId": "resume_abc123",
    "jobMatchId": "job_abc123",
    "version": 1,
    "scoreBreakdown": {
      "keywordMatch": 85,
      "formatCompliance": 90,
      "experienceMatch": 75,
      "skillsMatch": 88,
      "educationMatch": 70
    },
    "suggestions": [
      {
        "category": "keywords",
        "priority": "high",
        "issue": "Missing ATS keywords",
        "recommendation": "Add 'Agile' and 'SCRUM' to skills",
        "exampleText": "Agile & SCRUM methodologies"
      }
    ]
  }'
```

## 🔄 Switching to Firebase

When you're ready to use Firebase (instead of in-memory storage):

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create new project
   - Enable Firestore Database
   - Enable Authentication

2. **Get Credentials**
   - In Firebase → Settings → Service Accounts
   - Generate new private key (JSON)
   - Copy the values into `.env.local`

3. **Implement Firebase Adapter**
   - Open `src/lib/db/firebase-source.ts`
   - Replace stub methods with actual Firestore read/writes
   - Use admin SDK: `firebase-admin`

4. **Toggle in .env**
   ```
   USE_FIREBASE=true
   ```

5. **All API routes will switch automatically** — no code changes needed!

## 🎨 Design System

### Color Variables
```css
--primary: #0c6cf2      /* Primary actions, links */
--accent: #11c58a       /* Secondary actions */
--background: #f8fafc   /* Page background */
--surface: #ffffff      /* Card backgrounds */
--text: #0f172a         /* Main text */
--muted: #475569        /* Secondary text */
--line: #d9e3f5         /* Borders */
--section: #eef4ff      /* Section backgrounds */
```

### Tailwind Classes
- `.pill` - Rounded pill shape
- `.card` - Elevated card with shadow
- `.container-shell` - Max 1180px centered
- `.section-pad` - 5.5rem vertical padding

## 🧪 Testing

API routes can be tested with any REST client:
- **Postman** - Import collection or manually test
- **cURL** - Command-line examples above
- **Thunder Client** (VS Code extension)

## 📝 Next Steps

1. ✅ **Run the dev server** and explore `/`, `/dashboard`, `/platform`
2. ✅ **Test file upload** on `/dashboard`
3. ✅ **Play with API routes** using the examples above
4. **Extend results page** (`/app/results/page.tsx`) to display parsed resume
5. **Add interactive job matching** UI
6. **Implement Firebase** when ready
7. **Deploy to Vercel** - Works out of the box

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zod Validation](https://zod.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)

## 🛠️ Troubleshooting

### Port 3000 Already in Use
```bash
npm run dev -- -p 3001  # Use different port
```

### Module Not Found Errors
```bash
rm -r node_modules .next
npm install
npm run dev
```

### TypeScript Errors
```bash
npm run typecheck  # See all errors
# Fix them then run dev again
```

## 📄 License

Built for Skill Hunter - 2026

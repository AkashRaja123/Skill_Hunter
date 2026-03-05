# Setup Instructions

## Your Skill Hunter App is Ready! 🚀

The complete Next.js application has been scaffolded with:
- ✅ High-converting landing page  
- ✅ Resume upload dashboard with drag-drop  
- ✅ 6 production API endpoints  
- ✅ Full TypeScript type coverage  
- ✅ Firebase-ready data layer  
- ✅ Responsive Tailwind design  

## What You Have

```
Frontend:
  / - Landing page (drive conversions + pricing)
  /dashboard - Resume upload with steps & file drop
  /platform - System architecture overview

Backend:
  /api/users
  /api/resumes
  /api/job-matches
  /api/ats-scores
  /api/resume-modifications
  /api/applications

All with Zod validation, in-memory storage (Firebase pluggable)
```

## To Run Locally

### 1. Open Terminal in this folder
```
d:\kg hackathon
```

### 2. Install Dependencies
```powershell
npm install
```
*(Or `pnpm install` / `yarn install` / `bun install` if you have those)*

### 3. Configure Gemini API Key

**IMPORTANT:** The app requires a Gemini API key for resume parsing.

1. Go to [Google AI Studio](https://ai.google.dev/)
2. Click **"Get API Key"**
3. Create a new API key (free tier available)
4. Open `.env.local` file (already created for you)
5. Replace `your_gemini_api_key_here` with your actual key:

```
GEMINI_API_KEY=AIzaSyC-your-actual-key-here
```

### 4. Start Development Server
```powershell
npm run dev
```

### 5. Open Browser
```
http://localhost:3000
```

## What to Try

1. **Landing page** (`/`) - Review high-converting sections
2. **Click "Try It Free"** or **"Start Improving Resumes"** → Goes to `/dashboard`
3. **Dashboard** - Drag a file into the upload box or click to select
4. **View success state** after upload
5. **Test APIs** using REST tools (Postman, cURL, Thunder Client)

## File Structure

```
src/
├── app/
│   ├── api/         ← All 6 endpoints
│   ├── dashboard/   ← Resume upload page
│   ├── page.tsx     ← Landing page
│   └── layout.tsx   ← Root layout
├── components/      ← Reusable UI
├── lib/
│   ├── db/          ← Data layer (in-memory + Firebase stub)
│   ├── services/    ← ATS scoring logic
│   ├── validation/  ← Zod schemas
│   └── utils/       ← Helpers
```

## Using Firebase

Ready to switch from in-memory to Firebase?

1. Create Firebase project in [console.firebase.google.com](https://console.firebase.google.com)
2. Download service account JSON
3. Fill `.env.local` with credentials (see `.env.example`)
4. Set `USE_FIREBASE=true`
5. Implement Firebase methods in `src/lib/db/firebase-source.ts`
6. **All routes work automatically** — no other code changes

## Key Features

✅ **Type-Safe APIs** - Zod validates every request  
✅ **Reusable Data Abstraction** - Swap storage without changing routes  
✅ **Production URLs** - Use `/dashboard` not `#anchor` links  
✅ **Drag-Drop Upload** - Full UX in file-upload-box.tsx  
✅ **Responsive Design** - Mobile-first Tailwind  
✅ **Environment Config** - One flag switches data source  

## Next Steps

1. Run the dev server
2. Test the landing page & upload flow
3. Call the APIs from Postman/cURL
4. Extend `/app/results` page to show parsed resume data
5. Build job matching UI
6. Add Firebase

## Questions?

Check the `README.md` for full documentation, example API calls, and troubleshooting.

---

**You're all set!** Run `npm run dev` and explore. 🎉

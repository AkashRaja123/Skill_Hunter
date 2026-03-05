# ✅ Quick Start Checklist

Follow these steps to get Skill Hunter running with Gemini-powered resume parsing:

## Step 1: Get Your Gemini API Key ⚡

**Time needed: 2 minutes**

1. Go to [Google AI Studio](https://ai.google.dev/)
2. Sign in with your Google account
3. Click **"Get API Key"** at the top
4. Click **"Create API Key"**
5. Copy the generated key (starts with `AIzaSy...`)

✅ **Got your key?** Move to Step 2.

---

## Step 2: Configure Environment File 🔧

**Time needed: 1 minute**

1. Open `.env.local` in your code editor
2. Find this line:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
3. Replace `your_gemini_api_key_here` with your actual key:
   ```
   GEMINI_API_KEY=AIzaSyC-your-actual-key-here
   ```
4. Save the file

✅ **Saved?** Move to Step 3.

---

## Step 3: Install Dependencies 📦

**Time needed: 2-3 minutes**

Open terminal in the project folder and run:

```powershell
npm install
```

Or if you have others:
```powershell
pnpm install
# or
yarn install
# or
bun install
```

✅ **Installation complete?** Move to Step 4.

---

## Step 4: Start Development Server 🚀

**Time needed: 30 seconds**

```powershell
npm run dev
```

Wait for the message:
```
✓ Ready in 3.2s
○ Local:   http://localhost:3000
```

✅ **Server running?** Move to Step 5.

---

## Step 5: Test Resume Upload 📄

**Time needed: 1 minute**

1. Open browser: **http://localhost:3000**
2. Click **"Try It Free"** or **"Start Improving Resumes"**
3. Drag `test-resume-sample.txt` into the upload box
4. Watch the AI parse it in real-time
5. See the success message

✅ **Upload successful?** You're all set! 🎉

---

## What Next?

Now that everything works, you can:

### Immediate Actions:
- ✅ Upload your own resume
- ✅ Explore the landing page sections
- ✅ Check the `/platform` page for architecture details
- ✅ Test the API endpoints (see `API_TESTS.md`)

### Build Features:
- 📊 Create `/results` page to display parsed data
- 🎯 Add job matching UI
- 📈 Implement ATS scoring dashboard
- 👤 Add user authentication
- 🔥 Connect Firebase for production storage

### Deploy:
- 🌐 Deploy to Vercel (one-click deployment)
- ☁️ Set up environment variables in production
- 📊 Monitor Gemini API usage
- 🔒 Implement rate limiting

---

## Troubleshooting

### ❌ Error: "GEMINI_API_KEY is required"

**Solution:**
1. Make sure `.env.local` exists in the root folder
2. Check the key is on its own line without extra spaces
3. Restart the dev server: `Ctrl+C` then `npm run dev`

### ❌ Error: "Failed to parse resume"

**Solution:**
1. Make sure the file contains actual text (not empty)
2. Supported files: `.pdf`, `.txt`, `.doc`, or `.docx`
3. Check the file is readable and not corrupted
4. For PDFs, ensure they contain extractable text (not scanned images)

### ❌ Port 3000 already in use

**Solution:**
```powershell
npm run dev -- -p 3001
```
Then open `http://localhost:3001`

### ❌ Module not found errors

**Solution:**
```powershell
rm -r node_modules .next
npm install
npm run dev
```

---

## Files Reference

| File | Purpose |
|------|---------|
| `README.md` | Complete documentation |
| `SETUP.md` | Detailed setup instructions |
| `GEMINI_SETUP.md` | Deep dive into Gemini integration |
| `API_TESTS.md` | API endpoint testing examples |
| `.env.local` | Your environment configuration |
| `test-resume-sample.txt` | Sample resume for testing |

---

## Quick Commands

```powershell
# Install dependencies
npm install

# Start dev server
npm run dev

# Run type checking
npm run typecheck

# Run linter
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

---

## Support

Need help?
1. Check `README.md` for detailed docs
2. Review `GEMINI_SETUP.md` for API issues
3. See `API_TESTS.md` for testing examples
4. Check troubleshooting section above

---

**Ready to build?** Start with `npm install` and follow the steps! 🚀

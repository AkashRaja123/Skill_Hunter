# Gemini API Integration Guide

## Overview

Your Skill Hunter app now uses **Gemini 1.5 Flash** (gemini-1.5-flash) for intelligent resume parsing.

## What It Does

When a user uploads a resume (.txt, .doc, .docx), the system:

1. **Reads the file** content as plain text
2. **Sends to Gemini API** with a structured parsing prompt
3. **Receives JSON** with parsed resume data and AI analysis
4. **Saves to database** for job matching and ATS scoring

## Getting Your API Key

### Step 1: Visit Google AI Studio
Go to: [https://ai.google.dev/](https://ai.google.dev/)

### Step 2: Sign In
- Use your Google account
- No credit card required for free tier

### Step 3: Create API Key
- Click **"Get API Key"** in the top navigation
- Or go directly to: [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
- Click **"Create API Key"**
- Select a Google Cloud project (or create a new one)

### Step 4: Copy Your Key
```
AIzaSyC-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 5: Add to .env.local
Open `.env.local` and replace the placeholder:

```bash
GEMINI_API_KEY=AIzaSyC-your-actual-key-here
```

## Free Tier Limits

Gemini 1.5 Flash free tier includes:
- **15 requests per minute**
- **1 million tokens per day**
- **1,500 requests per day**

This is more than enough for development and small-scale production use.

## API Endpoint

**New Route Created:** `/api/parse-resume`

**Method:** POST  
**Content-Type:** multipart/form-data  
**Body:** `resumeText` (string)

### Example Request

```bash
curl -X POST http://localhost:3000/api/parse-resume \
  -F "resumeText=John Doe
Software Engineer
5 years experience with React, TypeScript, Node.js
..."
```

### Example Response

```json
{
  "success": true,
  "data": {
    "parsedData": {
      "personalInfo": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "location": "San Francisco, CA",
        "linkedin": "linkedin.com/in/johndoe",
        "portfolio": "johndoe.dev"
      },
      "skills": [
        {
          "skillName": "React",
          "category": "technical",
          "proficiency": "expert"
        },
        {
          "skillName": "TypeScript",
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
      "strengthAreas": [
        "Strong React and TypeScript expertise",
        "Full-stack capability"
      ],
      "improvementAreas": [
        "Limited DevOps experience",
        "No cloud certifications mentioned"
      ],
      "suggestedJobRoles": [
        "Senior Frontend Engineer",
        "Full Stack Developer",
        "React Developer"
      ],
      "overallQuality": 82
    }
  }
}
```

## How It Works

### 1. Resume Upload Flow

```
User uploads file → Read as text → Send to /api/parse-resume
                                          ↓
                              Call Gemini API with prompt
                                          ↓
                         Parse JSON response from Gemini
                                          ↓
                          Save to /api/resumes endpoint
                                          ↓
                        Show success + parsed data summary
```

### 2. Gemini Prompt Structure

The system sends a detailed prompt instructing Gemini to:
- Extract all personal information
- Identify and categorize skills (technical, soft, languages)
- Parse work experience with achievements
- Extract education, certifications, projects
- Analyze strengths and improvement areas
- Suggest best-fit job roles
- Score overall resume quality (0-100)

### 3. Response Handling

The parser:
- Validates JSON structure
- Handles markdown code blocks (```json ... ```)
- Extracts meaningful data
- Throws clear errors if parsing fails

## File Type Support

Fully supported:
- ✅ `.pdf` - PDF files (parsed using pdf-parse library)
- ✅ `.txt` - Plain text resumes
- ✅ `.doc` - Microsoft Word (older format)
- ✅ `.docx` - Microsoft Word (modern format)

## Error Handling

The system gracefully handles:
- **Empty files** - "File is empty or could not be read"
- **API errors** - Shows Gemini error message
- **Invalid JSON** - "Failed to parse resume"
- **Network errors** - "Failed to process resume"

Errors are displayed to users with a "Try again" option.

## Testing Locally

### 1. Create a Test Resume File

`test-resume.txt`:
```
John Doe
john.doe@email.com | +1-555-123-4567 | San Francisco, CA
linkedin.com/in/johndoe | github.com/johndoe

PROFESSIONAL SUMMARY
Senior Frontend Engineer with 5+ years building scalable web applications using React, TypeScript, and Node.js.

SKILLS
- Frontend: React, TypeScript, Next.js, Tailwind CSS
- Backend: Node.js, Express, PostgreSQL
- Tools: Git, Docker, AWS

EXPERIENCE

Senior Frontend Engineer | TechCorp | Jan 2021 - Present
- Led team of 5 engineers in rebuilding flagship product
- Reduced page load time by 40% through optimization
- Implemented design system used across 10+ applications

EDUCATION
BS Computer Science | UC Berkeley | 2019
GPA: 3.8/4.0
```

### 2. Upload Via Dashboard

1. Start the dev server: `npm run dev`
2. Go to `http://localhost:3000/dashboard`
3. Drop `test-resume.txt` into the upload box
4. Watch it parse in real-time
5. See success message with parsed data

### 3. Test API Directly

```bash
curl -X POST http://localhost:3000/api/parse-resume \
  -F "resumeText=$(cat test-resume.txt)"
```

## Customizing the Prompt

To adjust what Gemini extracts, edit the `PARSING_PROMPT` in:
`src/lib/services/resume-parser.ts`

You can:
- Add more fields (e.g., publications, awards)
- Change skill categories
- Adjust proficiency inference logic
- Modify AI analysis criteria

## Production Considerations

### Rate Limiting
If you exceed free tier limits, consider:
- Implementing request queuing
- Caching parsed results
- Upgrading to paid tier

### API Key Security
- **Never commit** `.env.local` to Git
- Use environment variables in production
- Rotate keys periodically
- Monitor usage in Google Cloud Console

### Cost Management
Current pricing (if you exceed free tier):
- Gemini 1.5 Flash: $0.075 per 1M input tokens
- Output tokens: $0.30 per 1M output tokens

A typical resume parsing uses ~2,000 input tokens and ~1,000 output tokens.

## Troubleshooting

### "GEMINI_API_KEY is required"
- Make sure `.env.local` exists
- Check the key is correctly formatted
- Restart the dev server after adding the key

### "Gemini API error: 400"
- Your API key might be invalid
- Check if you've enabled the Generative Language API
- Verify you're using the correct model name

### "Failed to parse resume"
- The file might be empty
- For PDFs, use a text extractor first
- Check if the file encoding is UTF-8

### Rate Limit Errors
- Wait 60 seconds and try again
- Reduce concurrent uploads
- Consider upgrading to paid tier

## Next Steps

1. ✅ Get your Gemini API key
2. ✅ Add it to `.env.local`
3. ✅ Start the dev server
4. ✅ Test with a sample resume
5. 🔄 Add PDF parsing support (optional)
6. 🔄 Implement user authentication
7. 🔄 Connect Firebase for production storage

## Resources

- [Gemini API Docs](https://ai.google.dev/docs)
- [Google AI Studio](https://ai.google.dev/)
- [Pricing](https://ai.google.dev/pricing)
- [API Quickstart](https://ai.google.dev/tutorials/get_started_web)

---

**Your resume parsing is now powered by Google's latest AI!** 🚀

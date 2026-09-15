# 🔍 Brave Search & Tech News Integration Guide

## Overview

This guide explains how to use the integrated **Brave Search API** and **Tech News Analyzer** to fetch daily tech news and identify which industries are improving.

## What This Does

The system:
- 🔎 Fetches latest tech news from Brave Search API
- 📊 Analyzes articles for industry-specific keywords and trends
- 📈 Calculates improvement scores for 10+ technology sectors
- 🚀 Provides daily forecasts on which industries are advancing
- 💡 Generates actionable insights about tech momentum

## Industries Tracked

| Industry | Keywords Monitored |
|----------|-------------------|
| Artificial Intelligence | AI, LLM, machine learning, neural networks, transformers, GPT, Claude, Gemini |
| Quantum Computing | quantum, qubit, quantum processor, quantum error correction |
| Web3 & Blockchain | blockchain, crypto, web3, NFT, smart contract, DeFi |
| Cloud Computing | cloud, AWS, Azure, GCP, kubernetes, serverless, edge computing |
| Cybersecurity | security, breach, vulnerability, threat detection, encryption, SIEM |
| Biotech & Healthcare | biotech, genomics, gene therapy, CRISPR, precision medicine |
| Robotics & Automation | robot, RPA, autonomous, drone, robotic process |
| Green Energy | renewable, solar, wind, battery, EV, sustainability |
| Extended Reality | VR, AR, metaverse, XR, spatial computing |
| 5G & Connectivity | 5G, 6G, satellite internet, bandwidth |

## Setup Instructions

### Step 1: Get a Brave Search API Key

1. Visit [Brave Search API](https://api.search.brave.com/)
2. Sign up for a free account
3. Generate an API key from the dashboard
4. Copy the API key

### Step 2: Add to Environment Variables

Edit your `.env.local` file:

```bash
# Add this line (optional - will use sample data without it)
BRAVE_SEARCH_API_KEY=your_api_key_here
```

Or copy the entry from `.env.example` and fill it in.

### Step 3: Restart Development Server

```bash
npm run dev
```

Visit http://localhost:3000/tech-news to see the daily industry forecast!

## Usage

### Via Web Dashboard

1. Navigate to **"Tech News & Industry Forecast"** in the navbar
2. Wait for the analysis to complete (10-15 seconds)
3. View:
   - 📡 Overall market momentum (Positive/Neutral/Negative)
   - 🏆 Top 5 improving industries ranked by score
   - 📊 Improvement percentage for each industry
   - 💬 Daily outlook and analysis
   - 🔑 Key technology areas being developed

### Via API

**Endpoint:** `GET /api/tech-news`

**Response:**
```json
{
  "success": true,
  "forecast": "🚀 TODAY'S INDUSTRY FORECAST:\n\n✨ TOP IMPROVING INDUSTRY: Artificial Intelligence\n...",
  "report": {
    "fetchedAt": "2026-03-05T10:30:00Z",
    "totalArticles": 20,
    "topIndustries": [
      {
        "industry": "Artificial Intelligence",
        "improvementScore": 85,
        "keyKeywords": ["LLM", "machine learning", "AI"],
        "dailyOutlook": "AI showing rapid advancement with multiple breakthroughs..."
      }
    ],
    "overallTechMomentum": "positive",
    "summary": "Today's tech landscape is thriving..."
  },
  "timestamp": "2026-03-05T10:30:00Z"
}
```

### Via Code

```typescript
import { getTodaysIndustryForecast, generateDailyTechReport } from "@/lib/services/tech-news-fetcher";

// Get text forecast
const forecast = await getTodaysIndustryForecast();
console.log(forecast);

// Get detailed report
const report = await generateDailyTechReport();
console.log(report.topIndustries);
```

## How Scoring Works

**Improvement Score Formula:**
```
Score = (Article Count × 20) + (Matched Keywords × 5)
Max: 100%
```

Example:
- 4 articles mentioning AI: 4 × 20 = 80
- 10 unique AI keywords matched: 10 × 5 = 50
- **Total Score: 85%** (capped at 100)

**Outlook Tiers:**
- **80-100%**: Rapid advancement with breakthroughs expected
- **60-79%**: Steady progress with notable improvements
- **40-59%**: Steady development with emerging opportunities
- **Below 40%**: Recent activity, monitor closely

## Without Brave API Key

If `BRAVE_SEARCH_API_KEY` is not configured, the system automatically uses **sample news data** to demonstrate functionality:

```typescript
// Fallback sample articles
- "OpenAI Releases New AI Model with 10x Performance Improvement"
- "Google Announces Quantum Chip Breakthrough"
- "Solar Panel Efficiency Reaches Record 50%"
- "Biotech Company Develops Gene Therapy Cure"
- "Cybersecurity Vulnerability Patched Across Enterprise"
```

This means you can test the feature immediately without an API key!

## Updating News Frequency

To fetch news at regular intervals, you can add a job scheduler:

```typescript
// pages/api/cron/fetch-tech-news.ts
import { generateDailyTechReport } from "@/lib/services/tech-news-fetcher";

export default async function handler(req, res) {
  // Verify cron secret
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const report = await generateDailyTechReport();
  // Save to database, send notifications, etc.
  
  res.json({ success: true, report });
}
```

Then schedule with Vercel Cron, GitHub Actions, or your preferred service.

## Customizing Industries

To add custom industries, edit `src/lib/services/tech-news-fetcher.ts`:

```typescript
const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  "My Custom Industry": [
    "keyword1",
    "keyword2",
    "keyword3"
  ],
  // ... rest of industries
};
```

## File Structure

```
src/
├── lib/
│   ├── services/
│   │   └── tech-news-fetcher.ts    # Core analysis engine
│   └── config/
│       └── env.ts                   # Environment variables
├── app/
│   ├── api/
│   │   └── tech-news/
│   │       └── route.ts             # API endpoint
│   └── tech-news/
│       └── page.tsx                 # Dashboard UI
└── components/
    └── site-navbar.tsx              # Links to tech news
```

## Troubleshooting

### API returns sample data
- ✅ **Expected if no Brave key is configured**
- Add `BRAVE_SEARCH_API_KEY` to `.env.local`
- Restart the dev server

### No industries showing up
- Check network tab - ensure `/api/tech-news` returns 200
- Verify `BRAVE_SEARCH_API_KEY` format
- Try with sample data (remove the key)

### Slow response time
- First request may take 10-15 seconds
- Brave API processes 20+ articles per request
- Caching recommended for production

## Production Deployment

### On Vercel:

1. Add `BRAVE_SEARCH_API_KEY` to environment variables in Vercel dashboard
2. Deploy normally

### On Other Platforms:

Set the environment variable in your hosting provider's dashboard.

## Next Steps

- 📊 **Add caching**: Store reports to avoid repeated API calls
- 🔔 **Add notifications**: Alert users when industries spike
- 📈 **Track history**: Compare daily scores over time
- 🎯 **Integrate with resume matching**: Suggest emerging tech skills
- 💾 **Save to database**: Persist reports for analytics

---

**Questions?** Check the main [README.md](./README.md) or review the code in `src/lib/services/tech-news-fetcher.ts`.

# Skill Hunter - Database Design Document

## Overview
This document outlines the database schema and design for the Skill Hunter application, which helps users optimize their resumes for specific job opportunities using AI-powered screening and ATS score calculation.

## Technology Stack
- **Database**: Firebase Firestore (NoSQL document database)
- **Storage**: Firebase Storage (for resume files)
- **Authentication**: Firebase Auth

## Core Entities

### 1. Users Collection
**Path**: `/users/{userId}`

Stores user profile and authentication data.

```javascript
{
  userId: string,              // Firebase Auth UID
  email: string,
  displayName: string,
  createdAt: timestamp,
  lastLoginAt: timestamp,
  profileComplete: boolean,
  metadata: {
    totalResumesUploaded: number,
    totalJobsApplied: number,
    averageATSScore: number
  }
}
```

**Indexes**:
- `email` (for quick lookup)
- `createdAt` (for sorting by registration date)

---

### 2. Resumes Collection
**Path**: `/users/{userId}/resumes/{resumeId}`

Stores parsed resume data and file references.

```javascript
{
  resumeId: string,            // Auto-generated
  userId: string,              // Reference to user
  uploadedAt: timestamp,
  lastModifiedAt: timestamp,
  
  // Parsed resume data
  parsedData: {
    personalInfo: {
      name: string,
      email: string,
      phone: string,
      location: string,
      linkedin: string,
      portfolio: string
    },
    
    skills: [
      {
        skillName: string,
        category: string,      // 'technical', 'soft', 'language', etc.
        proficiency: string    // 'beginner', 'intermediate', 'expert'
      }
    ],
    
    experience: [
      {
        company: string,
        position: string,
        startDate: string,
        endDate: string,
        description: string,
        achievements: [string]
      }
    ],
    
    education: [
      {
        institution: string,
        degree: string,
        field: string,
        graduationDate: string,
        gpa: string
      }
    ],
    
    certifications: [
      {
        name: string,
        issuer: string,
        dateObtained: string,
        expiryDate: string
      }
    ],
    
    projects: [
      {
        name: string,
        description: string,
        technologies: [string],
        url: string
      }
    ]
  },
  
  // AI analysis
  aiAnalysis: {
    strengthAreas: [string],
    improvementAreas: [string],
    suggestedJobRoles: [string],
    overallQuality: number       // 0-100
  }
}
```

**Indexes**:
- `userId` + `uploadedAt` (for fetching user's resumes chronologically)
- `status` (for filtering by processing status)

---

### 3. Job Matches Collection
**Path**: `/users/{userId}/jobMatches/{jobMatchId}`

Stores jobs recommended by AI based on resume analysis.

```javascript
{
  jobMatchId: string,          // Auto-generated
  userId: string,
  resumeId: string,            // Which resume was used
  
  // Job details from DeepSeek-AI/Brave MCP
  jobDetails: {
    title: string,
    company: string,
    location: string,
    jobType: string,           // 'full-time', 'part-time', 'contract', 'remote'
    experienceLevel: string,   // 'entry', 'mid', 'senior', 'lead'
    salary: {
      min: number,
      max: number,
      currency: string
    },
    description: string,
    requirements: [string],
    responsibilities: [string],
    benefits: [string],
    sourceUrl: string,
    postedDate: timestamp
  },
  
  // Matching metadata
  matchScore: number,          // 0-100 (how well resume matches job)
  matchedSkills: [string],
  missingSkills: [string],
  
  fetchedAt: timestamp,
  isBookmarked: boolean,
  status: string               // 'suggested', 'selected', 'applied', 'rejected'
}
```

**Indexes**:
- `userId` + `matchScore` (descending - for showing best matches first)
- `userId` + `status` + `fetchedAt` (for filtering and sorting)
- `resumeId` (for finding jobs matched to specific resume)

---

### 4. ATS Scores Collection
**Path**: `/users/{userId}/atsScores/{atsScoreId}`

Tracks ATS score history for resume-job combinations.

```javascript
{
  atsScoreId: string,          // Auto-generated
  userId: string,
  resumeId: string,
  jobMatchId: string,
  
  score: number,               // 0-100
  calculatedAt: timestamp,
  version: number,             // Iteration number (1, 2, 3...)
  
  // Detailed breakdown
  scoreBreakdown: {
    keywordMatch: number,      // 0-100
    formatCompliance: number,  // 0-100
    experienceMatch: number,   // 0-100
    skillsMatch: number,       // 0-100
    educationMatch: number     // 0-100
  },
  
  // Improvement suggestions
  suggestions: [
    {
      category: string,        // 'keywords', 'format', 'experience', 'skills'
      priority: string,        // 'high', 'medium', 'low'
      issue: string,
      recommendation: string,
      exampleText: string
    }
  ],
  
  // Comparison with previous version
  previousScore: number,
  improvement: number,         // Difference from previous score
  
  passedThreshold: boolean     // true if score >= 90
}
```

**Indexes**:
- `userId` + `jobMatchId` + `version` (for tracking improvement iterations)
- `resumeId` + `jobMatchId` (for finding scores for specific resume-job pair)
- `calculatedAt` (for chronological sorting)

---

### 5. Resume Modifications Collection
**Path**: `/users/{userId}/resumeModifications/{modificationId}`

Tracks changes made to resumes for specific jobs.

```javascript
{
  modificationId: string,      // Auto-generated
  userId: string,
  originalResumeId: string,
  jobMatchId: string,
  atsScoreId: string,          // Which ATS score triggered this
  
  modifiedAt: timestamp,
  modificationType: string,    // 'ai-suggested', 'user-edited', 'hybrid'
  
  // Changes made
  changes: [
    {
      section: string,         // 'skills', 'experience', 'summary', etc.
      changeType: string,      // 'added', 'removed', 'rephrased', 'reordered'
      originalText: string,
      modifiedText: string,
      reason: string
    }
  ],
  
  // Modified resume data (same structure as parsedData in Resumes)
  modifiedResumeData: { /* same as parsedData */ },
  
  status: string               // 'draft', 'finalized', 'applied'
}
```

**Indexes**:
- `userId` + `jobMatchId` (for finding modifications for specific job)
- `originalResumeId` (for tracking all versions of a resume)
- `modifiedAt` (for chronological sorting)

---

### 6. Application Tracking Collection
**Path**: `/users/{userId}/applications/{applicationId}`

Tracks job applications and their status.

```javascript
{
  applicationId: string,       // Auto-generated
  userId: string,
  resumeId: string,            // Final resume used
  jobMatchId: string,
  
  appliedAt: timestamp,
  finalATSScore: number,
  
  applicationStatus: string,   // 'applied', 'screening', 'interview', 'offer', 'rejected', 'accepted'
  statusHistory: [
    {
      status: string,
      updatedAt: timestamp,
      notes: string
    }
  ],
  
  interviewDetails: [
    {
      round: number,
      type: string,            // 'phone', 'technical', 'behavioral', 'final'
      scheduledAt: timestamp,
      completedAt: timestamp,
      feedback: string
    }
  ],
  
  notes: string,
  followUpDate: timestamp
}
```

**Indexes**:
- `userId` + `applicationStatus` + `appliedAt` (for filtering and sorting)
- `jobMatchId` (for linking back to job details)

---

## Data Flow & Sorting Strategies

### 1. Resume Upload Flow
```
1. User uploads resume → Parse resume (AI/backend service)
2. Create document in /users/{userId}/resumes/{resumeId}
3. Store parsedData in document
4. Set uploadedAt timestamp
```

### 2. Job Matching Flow
```
1. Query DeepSeek-AI and Brave MCP with resume skills
2. Create documents in /users/{userId}/jobMatches/
3. Sort by matchScore (descending)
4. Display top matches to user
```

### 3. ATS Score Calculation Flow
```
1. User selects job → Create initial ATS score document (version: 1)
2. If score < 90:
   a. Generate suggestions
   b. Create modification document
   c. User/AI modifies resume
   d. Recalculate score (version: 2)
   e. Repeat until score >= 90 or max iterations reached
```

### 4. Query Patterns

**Get user's latest resume:**
```javascript
db.collection('users').doc(userId)
  .collection('resumes')
  .where('status', '==', 'parsed')
  .orderBy('uploadedAt', 'desc')
  .limit(1)
```

**Get best job matches:**
```javascript
db.collection('users').doc(userId)
  .collection('jobMatches')
  .where('status', '==', 'suggested')
  .orderBy('matchScore', 'desc')
  .limit(20)
```

**Get ATS score history for a job:**
```javascript
db.collection('users').doc(userId)
  .collection('atsScores')
  .where('jobMatchId', '==', jobMatchId)
  .orderBy('version', 'asc')
```

**Get active applications:**
```javascript
db.collection('users').doc(userId)
  .collection('applications')
  .where('applicationStatus', 'in', ['applied', 'screening', 'interview'])
  .orderBy('appliedAt', 'desc')
```

---

## Security Rules (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /resumes/{resumeId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      match /jobMatches/{jobMatchId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      match /atsScores/{atsScoreId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      match /resumeModifications/{modificationId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      match /applications/{applicationId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

---

## Performance Optimization

### Composite Indexes (Required)
1. `users/{userId}/jobMatches`: `userId` + `matchScore` (desc) + `status`
2. `users/{userId}/atsScores`: `userId` + `jobMatchId` + `version` (asc)
3. `users/{userId}/applications`: `userId` + `applicationStatus` + `appliedAt` (desc)

### Caching Strategy
- Cache frequently accessed data (user profile, latest resume)
- Use Firebase Realtime listeners for live updates on ATS scores
- Implement pagination for job matches (20 per page)

### Data Retention
- Keep all ATS score versions for analytics
- Archive applications older than 1 year to separate collection
- Delete draft modifications after 30 days if not finalized

---

## Scalability Considerations

### 1. Caching Strategy (Firebase + Vercel)

**Client-Side Caching**
```javascript
// Cache user profile and latest resume in memory
const cache = {
  userProfile: null,
  latestResume: null,
  jobMatches: new Map(),
  ttl: 5 * 60 * 1000 // 5 minutes
};

// Use SWR (stale-while-revalidate) pattern
import useSWR from 'swr';

const { data, error } = useSWR(
  `/api/users/${userId}/resumes/latest`,
  fetcher,
  { 
    revalidateOnFocus: false,
    dedupingInterval: 300000 // 5 minutes
  }
);
```

**Firebase Persistence Cache**
```javascript
// Enable offline persistence (automatic caching)
import { enableIndexedDbPersistence } from 'firebase/firestore';

enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open
    } else if (err.code == 'unimplemented') {
      // Browser doesn't support
    }
  });
```

**Vercel Edge Caching**
```javascript
// API route with cache headers
export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const data = await fetchJobMatches();
  
  return new Response(JSON.stringify(data), {
    headers: {
      'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
      'Content-Type': 'application/json',
    },
  });
}
```

**What to Cache:**
- User profile data (5 min TTL)
- Latest parsed resume (10 min TTL)
- Job matches list (5 min TTL)
- ATS score results (cache until new calculation)
- Static job descriptions (1 hour TTL)

---

### 2. Server-Side Rendering (SSR) with Next.js on Vercel

**SSR for SEO-Critical Pages**
```javascript
// pages/jobs/[jobId].js
export async function getServerSideProps(context) {
  const { jobId } = context.params;
  
  // Fetch job details server-side
  const jobData = await fetchJobDetails(jobId);
  
  return {
    props: {
      job: jobData,
    },
  };
}

export default function JobDetailsPage({ job }) {
  return <JobDetails job={job} />;
}
```

**Use SSR for:**
- Public job listings (SEO benefit)
- Landing pages
- Shared resume links
- Application status pages

**Use Client-Side Rendering for:**
- Dashboard (requires auth)
- Resume editor
- Real-time ATS score updates
- User-specific data

---

### 3. Dynamic Imports & Lazy Loading

**Component-Level Code Splitting**
```javascript
import dynamic from 'next/dynamic';

// Lazy load heavy components
const ResumeEditor = dynamic(() => import('@/components/ResumeEditor'), {
  loading: () => <Skeleton />,
  ssr: false, // Don't render on server
});

const ATSScoreChart = dynamic(() => import('@/components/ATSScoreChart'), {
  loading: () => <ChartSkeleton />,
});

const PDFViewer = dynamic(() => import('@/components/PDFViewer'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});
```

**Route-Based Code Splitting**
```javascript
// Automatically handled by Next.js
// Each page in /pages is a separate bundle

// pages/dashboard.js - Bundle 1
// pages/jobs.js - Bundle 2
// pages/resume-editor.js - Bundle 3
```

**Library Code Splitting**
```javascript
// Only load PDF library when needed
const loadPDFLib = async () => {
  const pdfLib = await import('pdf-lib');
  return pdfLib;
};

// Only load chart library on ATS score page
const loadChartLib = async () => {
  const { Chart } = await import('chart.js');
  return Chart;
};
```

**Lazy Load Strategies:**
- Resume PDF viewer (load on demand)
- Rich text editor (load when editing)
- Chart libraries (load on ATS score page)
- AI suggestion components (load after score calculation)
- File upload components (load on upload page)

---

### 4. Incremental Static Regeneration (ISR)

**ISR for Job Listings**
```javascript
// pages/jobs/index.js
export async function getStaticProps() {
  const publicJobs = await fetchPublicJobs();
  
  return {
    props: {
      jobs: publicJobs,
    },
    revalidate: 3600, // Regenerate every hour
  };
}

export default function JobsPage({ jobs }) {
  return <JobList jobs={jobs} />;
}
```

**ISR for Individual Job Pages**
```javascript
// pages/jobs/[jobId].js
export async function getStaticPaths() {
  // Generate paths for top 100 jobs
  const topJobs = await fetchTopJobs(100);
  
  return {
    paths: topJobs.map(job => ({
      params: { jobId: job.id }
    })),
    fallback: 'blocking', // Generate on-demand for others
  };
}

export async function getStaticProps({ params }) {
  const job = await fetchJobDetails(params.jobId);
  
  return {
    props: { job },
    revalidate: 1800, // Regenerate every 30 minutes
  };
}
```

**ISR for Blog/Resources**
```javascript
// pages/resources/[slug].js
export async function getStaticProps({ params }) {
  const article = await fetchArticle(params.slug);
  
  return {
    props: { article },
    revalidate: 86400, // Regenerate daily
  };
}
```

**ISR Strategy:**
- Public job listings: Revalidate every 1 hour
- Individual job pages: Revalidate every 30 minutes
- Blog/resources: Revalidate daily
- Landing pages: Revalidate every 6 hours
- Use `fallback: 'blocking'` for on-demand generation

---

### 5. Firebase-Specific Optimizations

**Firestore Query Optimization**
```javascript
// Use query cursors for pagination
const firstBatch = await db.collection('users').doc(userId)
  .collection('jobMatches')
  .orderBy('matchScore', 'desc')
  .limit(20)
  .get();

const lastVisible = firstBatch.docs[firstBatch.docs.length - 1];

// Next page
const nextBatch = await db.collection('users').doc(userId)
  .collection('jobMatches')
  .orderBy('matchScore', 'desc')
  .startAfter(lastVisible)
  .limit(20)
  .get();
```

**Firestore Realtime Listeners (Selective)**
```javascript
// Only use realtime listeners for critical updates
const unsubscribe = db.collection('users').doc(userId)
  .collection('atsScores')
  .where('jobMatchId', '==', selectedJobId)
  .orderBy('version', 'desc')
  .limit(1)
  .onSnapshot((snapshot) => {
    // Update UI when new ATS score is calculated
    const latestScore = snapshot.docs[0].data();
    updateScoreDisplay(latestScore);
  });

// Clean up listener when component unmounts
return () => unsubscribe();
```

**Firebase Storage Optimization**
```javascript
// Use signed URLs with expiration
const getResumeUrl = async (resumePath) => {
  const storage = getStorage();
  const resumeRef = ref(storage, resumePath);
  
  // URL expires in 1 hour
  const url = await getDownloadURL(resumeRef);
  return url;
};

// Compress files before upload
const compressAndUpload = async (file) => {
  const compressed = await compressFile(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
  });
  
  await uploadBytes(storageRef, compressed);
};
```

---

### 6. Vercel-Specific Optimizations

**Edge Functions for Low Latency**
```javascript
// api/check-auth.js
export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // Runs on edge, closer to user
  const token = req.headers.get('authorization');
  const isValid = await verifyToken(token);
  
  return new Response(JSON.stringify({ valid: isValid }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
```

**Image Optimization**
```javascript
import Image from 'next/image';

// Automatic optimization by Vercel
<Image
  src="/company-logo.png"
  width={200}
  height={100}
  alt="Company Logo"
  loading="lazy"
  placeholder="blur"
/>
```

**API Route Optimization**
```javascript
// api/jobs/[id].js
export default async function handler(req, res) {
  const { id } = req.query;
  
  // Set cache headers
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
  
  const job = await fetchJob(id);
  res.status(200).json(job);
}
```

---

### 7. Additional Scalability Patterns

**Subcollections for Data Isolation**
- Using subcollections under users ensures data isolation and better query performance
- Each user's data is independent, preventing cross-user query issues

**Denormalization for Read Performance**
- Store frequently accessed data (like job title, company) in multiple places to reduce reads
- Example: Store job title in both jobMatches and applications collections

**Batch Operations**
```javascript
// Use batch writes when creating multiple related documents
const batch = writeBatch(db);

batch.set(resumeRef, resumeData);
batch.update(userRef, { totalResumes: increment(1) });
batch.set(analysisRef, analysisData);

await batch.commit();
```

**Cloud Functions for Background Processing**
```javascript
// Trigger resume parsing in background
exports.onResumeUpload = functions.firestore
  .document('users/{userId}/resumes/{resumeId}')
  .onCreate(async (snap, context) => {
    const resumeData = snap.data();
    
    // Parse resume asynchronously
    const parsed = await parseResume(resumeData.fileUrl);
    
    // Update document
    await snap.ref.update({
      parsedData: parsed,
      status: 'parsed'
    });
  });
```

**Rate Limiting for API Calls**
```javascript
// Implement rate limits on AI API calls to manage costs
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window per user
  keyGenerator: (req) => req.user.id,
});

app.use('/api/calculate-ats', limiter);
```

---

### 8. Performance Monitoring

**Vercel Analytics**
```javascript
// pages/_app.js
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
```

**Firebase Performance Monitoring**
```javascript
import { getPerformance } from 'firebase/performance';

const perf = getPerformance(app);

// Automatically tracks page loads and network requests
```

---

### Summary: Vercel Free Tier Limits

- **Bandwidth**: 100 GB/month
- **Serverless Function Execution**: 100 GB-hours/month
- **Edge Functions**: 500k requests/month
- **Build Time**: 6 hours/month

**Optimization Strategy for Free Tier:**
1. Use ISR to reduce serverless function calls
2. Implement aggressive caching (client + edge)
3. Lazy load heavy components
4. Use Edge Functions for auth checks
5. Optimize images with Next.js Image component
6. Implement pagination to reduce data transfer

---

## Future Enhancements

1. Add analytics collection for tracking user behavior
2. Implement skill taxonomy collection for standardized skill matching
3. Add company reviews/ratings collection
4. Create notification preferences collection
5. Add resume templates collection for different industries

# API Test Reference

Quick curl/REST examples to test the backend endpoints.

## Health Check

```bash
curl http://localhost:3000/api/health
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "service": "skill-hunter-api",
    "timestamp": "2026-03-05T..."
  }
}
```

---

## Users API

### Create User

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_001",
    "email": "john.doe@example.com",
    "displayName": "John Doe",
    "profileComplete": false
  }'
```

### List Users

```bash
curl "http://localhost:3000/api/users"
```

---

## Resumes API

### Create Resume (with Parsed Data)

```bash
curl -X POST http://localhost:3000/api/resumes \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_001",
    "parsedData": {
      "personalInfo": {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "phone": "+1-555-123-4567",
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
        },
        {
          "skillName": "Communication",
          "category": "soft",
          "proficiency": "expert"
        }
      ],
      "experience": [
        {
          "company": "TechCorp",
          "position": "Senior Frontend Engineer",
          "startDate": "2021-01",
          "endDate": "present",
          "description": "Led frontend team in building scalable web applications",
          "achievements": [
            "Reduced page load time by 40%",
            "Mentored 5 junior engineers"
          ]
        }
      ],
      "education": [
        {
          "institution": "UC Berkeley",
          "degree": "BS",
          "field": "Computer Science",
          "graduationDate": "2019",
          "gpa": "3.8"
        }
      ],
      "certifications": [
        {
          "name": "AWS Solutions Architect",
          "issuer": "Amazon Web Services",
          "dateObtained": "2023-06",
          "expiryDate": "2025-06"
        }
      ],
      "projects": [
        {
          "name": "E-Commerce Platform",
          "description": "Built full-stack marketplace with 50k+ users",
          "technologies": ["React", "Node.js", "PostgreSQL"],
          "url": "https://example.com"
        }
      ]
    },
    "aiAnalysis": {
      "strengthAreas": [
        "Strong React and TypeScript expertise",
        "Leadership and mentoring experience",
        "Full-stack capability"
      ],
      "improvementAreas": [
        "Limited DevOps/Infrastructure experience",
        "No blockchain/Web3 mentions"
      ],
      "suggestedJobRoles": [
        "Senior Frontend Engineer",
        "Tech Lead",
        "Engineering Manager"
      ],
      "overallQuality": 85
    }
  }'
```

### List Resumes

```bash
curl "http://localhost:3000/api/resumes?userId=user_001"
```

---

## Job Matches API

### Create Job Match

```bash
curl -X POST http://localhost:3000/api/job-matches \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_001",
    "resumeId": "resume_...",
    "jobDetails": {
      "title": "Senior Frontend Engineer",
      "company": "Google",
      "location": "Mountain View, CA",
      "jobType": "full-time",
      "experienceLevel": "senior",
      "salary": {
        "min": 180000,
        "max": 240000,
        "currency": "USD"
      },
      "description": "Build scalable web applications using modern tech stack",
      "requirements": [
        "5+ years React experience",
        "TypeScript proficiency",
        "System design knowledge"
      ],
      "responsibilities": [
        "Design and implement new features",
        "Mentor junior engineers",
        "Code review and architecture discussions"
      ],
      "benefits": [
        "Competitive salary",
        "Stock options",
        "Health insurance",
        "Remote work flexibility"
      ],
      "sourceUrl": "https://careers.google.com/jobs/...",
      "postedDate": "2026-03-01T00:00:00Z"
    },
    "matchScore": 92,
    "matchedSkills": ["React", "TypeScript", "System Design"],
    "missingSkills": ["Kubernetes"],
    "isBookmarked": false,
    "status": "suggested"
  }'
```

### List Job Matches

```bash
curl "http://localhost:3000/api/job-matches?userId=user_001&status=suggested"
```

---

## ATS Scores API

### Calculate ATS Score

```bash
curl -X POST http://localhost:3000/api/ats-scores \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_001",
    "resumeId": "resume_...",
    "jobMatchId": "job_...",
    "version": 1,
    "scoreBreakdown": {
      "keywordMatch": 88,
      "formatCompliance": 92,
      "experienceMatch": 85,
      "skillsMatch": 90,
      "educationMatch": 80
    },
    "suggestions": [
      {
        "category": "keywords",
        "priority": "high",
        "issue": "Missing job posting keywords",
        "recommendation": "Add 'Agile', 'SCRUM', and 'CI/CD' to skills section",
        "exampleText": "Agile & SCRUM methodologies, CI/CD pipelines"
      },
      {
        "category": "format",
        "priority": "medium",
        "issue": "Could improve formatting visibility",
        "recommendation": "Use bullet points consistently for achievements",
        "exampleText": "• Improved application performance by 40%"
      }
    ]
  }'
```

### List ATS Scores

```bash
curl "http://localhost:3000/api/ats-scores?userId=user_001&jobMatchId=job_..."
```

---

## Resume Modifications API

### Create Modification

```bash
curl -X POST http://localhost:3000/api/resume-modifications \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_001",
    "originalResumeId": "resume_...",
    "jobMatchId": "job_...",
    "atsScoreId": "ats_...",
    "modificationType": "ai-suggested",
    "changes": [
      {
        "section": "skills",
        "changeType": "added",
        "originalText": "React, TypeScript, Node.js",
        "modifiedText": "React, TypeScript, Node.js, Agile, SCRUM, CI/CD",
        "reason": "Add high-priority ATS keywords"
      }
    ],
    "modifiedResumeData": {
      "personalInfo": {},
      "skills": [],
      "experience": [],
      "education": [],
      "certifications": [],
      "projects": []
    },
    "status": "draft"
  }'
```

### List Modifications

```bash
curl "http://localhost:3000/api/resume-modifications?userId=user_001"
```

---

## Applications API

### Create Application

```bash
curl -X POST http://localhost:3000/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_001",
    "resumeId": "resume_...",
    "jobMatchId": "job_...",
    "finalATSScore": 92,
    "applicationStatus": "applied",
    "statusHistory": [
      {
        "status": "applied",
        "updatedAt": "2026-03-05T10:00:00Z",
        "notes": "Application submitted"
      }
    ],
    "interviewDetails": [],
    "notes": "Strong fit for this role",
    "followUpDate": "2026-03-12T00:00:00Z"
  }'
```

### List Applications

```bash
curl "http://localhost:3000/api/applications?userId=user_001&status=applied"
```

---

## Testing in Postman

1. Import these as raw requests
2. Replace placeholder IDs with actual returned IDs
3. Chain requests together to test full workflow
4. Use environment variables for `userId`, `resumeId`, etc.

## Testing in Thunder Client (VS Code)

1. Install Thunder Client extension
2. Create new request for each endpoint
3. Set method (GET/POST)
4. Paste URL and JSON body
5. Click Send

---

**All endpoints return:**
```json
{
  "success": true,
  "data": { /* response data */ }
}
```

**On error:**
```json
{
  "success": false,
  "error": "Error message",
  "details": { /* validation details if applicable */ }
}
```

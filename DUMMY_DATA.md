# Adding Dummy Data to HR Dashboard

This guide explains how to populate the HR dashboard with realistic job seeker data for testing and demonstration purposes.

## Quick Start

### Option 1: Using the Seed API Endpoint

The easiest way to seed dummy data is to make a POST request to the `/api/seed` endpoint:

```bash
# Using curl
curl -X POST http://localhost:3000/api/seed \
  -H 'Authorization: Bearer seed-secret'

# Using PowerShell
$headers = @{
    'Authorization' = 'Bearer seed-secret'
}
Invoke-WebRequest -Uri 'http://localhost:3000/api/seed' -Method POST -Headers $headers
```

### Option 2: Manual Seeding in Code

Import and call the `seedDummyData()` function directly in your code:

```typescript
import { seedDummyData } from "@/lib/db/seed";

// Call during app initialization or in a script
await seedDummyData();
```

### Option 3: Create a Manual Seed Script

Create a TypeScript script in your project:

```typescript
// scripts/seed.ts
import { seedDummyData } from "@/lib/db/seed";

seedDummyData()
  .then(() => {
    console.log("Seeding completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
```

Then run:
```bash
tsx scripts/seed.ts
```

## What Gets Seeded

The dummy data includes:

- **8 Job Seekers** - Realistic profiles with varying experience levels
- **8 Resumes** - Complete resume data with skills, experience, education, projects
- **4 Job Matches** - Job opportunities matched to candidates
- **8 Applications** - Application records showing different statuses:
  - 1 Interview (in progress)
  - 1 Screening (in progress)
  - 1 Offer (ready to decide)
  - 1 Applied (new)
  - 1 Rejected
  - 1 Accepted (hired)
  - Others in various stages
- **8 ATS Scores** - Scoring breakdown for each candidate

## Sample Candidates

The dummy data includes candidates from various fields:

1. **Alex Johnson** - Senior Frontend Developer (React/TypeScript expert)
2. **Sarah Williams** - Senior Data Analyst (Python/Data Analysis)
3. **Michael Chen** - DevOps Engineer (Kubernetes/AWS expert)
4. **Jessica Martinez** - Program Manager (Project Management/Agile)
5. **David Kumar** - Lead Backend Engineer (Java/Spring Boot)
6. **Emma Smith** - UX/UI Designer (Figma/Design Systems)
7. **Robert Thompson** - Senior Systems Engineer (C++/Performance)
8. **Laura Patel** - Senior Product Manager (Product Strategy)

## Dashboard Features

Once seeded, the HR dashboard will show:

- **Overview Tab** - Stats on total candidates, new applications, pipeline metrics
- **Pipeline Tab** - Kanban board view of candidates by status
- **Candidates Tab** - Searchable, filterable table with:
  - Name, email, applied role
  - ATS score
  - Application status
  - Top skills
  - Applied date
- **Analytics Tab** - Metrics and insights about the candidate pipeline

## Environment Variables

Secure the seed endpoint by setting:

```env
# .env.local
SEED_SECRET=your-custom-secret-key
```

This will require the Authorization header to include this secret for POST requests.

## Data Source Support

The dummy data works with all supported data sources:

- **Firebase** - Cloud Firestore
- **In-Memory** - For development/testing
- **SQL Database** - PostgreSQL, MySQL, etc.

Choose your data source in [src/lib/config/env.ts](../config/env.ts):

```typescript
const DATA_PROVIDER = "firebase" | "in-memory" | "sql";
```

## Re-seeding

If you want to reset and re-seed data:

1. Clear your existing data source (database, Firestore, etc.)
2. Call the seed endpoint or function again
3. HR dashboard will show fresh dummy data

## Files Modified/Added

- `src/lib/db/dummy-data.ts` - Complete dummy dataset definitions
- `src/lib/db/seed.ts` - Seeding utility function
- `src/app/api/seed/route.ts` - API endpoint for seeding
- `DUMMY_DATA.md` - This documentation file

## Troubleshooting

**Issue**: Seeding fails with database connection error
- **Solution**: Ensure your database is running and connection string is correct

**Issue**: Authorization fails
- **Solution**: Check your SEED_SECRET environment variable matches what you're sending

**Issue**: Data not showing in dashboard
- **Solution**: Refresh the page (Ctrl+R), check browser console for errors

## Notes

- Dummy data uses realistic but fictional information
- All email addresses are examples and don't receive notifications
- Dates are set relative to March 6, 2026
- ATS scores are pre-calculated and static
- You can modify dummy data in `src/lib/db/dummy-data.ts` to customize candidates

For more information, see the HR Dashboard documentation.

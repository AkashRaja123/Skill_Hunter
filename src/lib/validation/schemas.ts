import { z } from "zod";

const isoDate = z.string().datetime().or(z.string().min(1));

const parsedResumeDataSchema = z.object({
  personalInfo: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    location: z.string().optional(),
    linkedin: z.string().optional(),
    portfolio: z.string().optional()
  }),
  skills: z.array(
    z.object({
      skillName: z.string().min(1),
      category: z.string().min(1),
      proficiency: z.enum(["beginner", "intermediate", "expert"])
    })
  ),
  experience: z.array(
    z.object({
      company: z.string().min(1),
      position: z.string().min(1),
      startDate: z.string().min(1),
      endDate: z.string().min(1),
      description: z.string().min(1),
      achievements: z.array(z.string().min(1))
    })
  ),
  education: z.array(
    z.object({
      institution: z.string().min(1),
      degree: z.string().min(1),
      field: z.string().min(1),
      graduationDate: z.string().min(1),
      gpa: z.string().optional()
    })
  ),
  certifications: z.array(
    z.object({
      name: z.string().min(1),
      issuer: z.string().min(1),
      dateObtained: z.string().min(1),
      expiryDate: z.string().optional()
    })
  ),
  projects: z.array(
    z.object({
      name: z.string().min(1),
      description: z.string().min(1),
      technologies: z.array(z.string().min(1)),
      url: z.string().url().optional()
    })
  )
});

export const createUserSchema = z.object({
  userId: z.string().min(1),
  email: z.string().email(),
  displayName: z.string().min(1),
  profileComplete: z.boolean().default(false)
});

export const createResumeSchema = z.object({
  userId: z.string().min(1),
  parsedData: parsedResumeDataSchema,
  aiAnalysis: z.object({
    strengthAreas: z.array(z.string()),
    improvementAreas: z.array(z.string()),
    suggestedJobRoles: z.array(z.string()),
    overallQuality: z.number().min(0).max(100)
  })
});

export const createJobMatchSchema = z.object({
  userId: z.string().min(1),
  resumeId: z.string().min(1),
  jobDetails: z.object({
    title: z.string().min(1),
    company: z.string().min(1),
    location: z.string().min(1),
    jobType: z.enum(["full-time", "part-time", "contract", "remote"]),
    experienceLevel: z.enum(["entry", "mid", "senior", "lead"]),
    salary: z.object({
      min: z.number().nonnegative(),
      max: z.number().nonnegative(),
      currency: z.string().min(1)
    }),
    description: z.string().min(1),
    requirements: z.array(z.string()),
    responsibilities: z.array(z.string()),
    benefits: z.array(z.string()),
    sourceUrl: z.string().url(),
    postedDate: isoDate
  }),
  matchScore: z.number().min(0).max(100),
  matchedSkills: z.array(z.string()),
  missingSkills: z.array(z.string()),
  isBookmarked: z.boolean().default(false),
  status: z.enum(["suggested", "selected", "applied", "rejected"]).default("suggested")
});

export const createATSScoreSchema = z.object({
  userId: z.string().min(1),
  resumeId: z.string().min(1),
  jobMatchId: z.string().min(1),
  version: z.number().int().positive(),
  score: z.number().min(0).max(100).optional(),
  scoreBreakdown: z.object({
    keywordMatch: z.number().min(0).max(100),
    formatCompliance: z.number().min(0).max(100),
    experienceMatch: z.number().min(0).max(100),
    skillsMatch: z.number().min(0).max(100),
    educationMatch: z.number().min(0).max(100)
  }),
  suggestions: z.array(
    z.object({
      category: z.enum(["keywords", "format", "experience", "skills"]),
      priority: z.enum(["high", "medium", "low"]),
      issue: z.string().min(1),
      recommendation: z.string().min(1),
      exampleText: z.string().optional()
    })
  ),
  previousScore: z.number().min(0).max(100).optional()
});

export const createResumeModificationSchema = z.object({
  userId: z.string().min(1),
  originalResumeId: z.string().min(1),
  jobMatchId: z.string().min(1),
  atsScoreId: z.string().min(1),
  modificationType: z.enum(["ai-suggested", "user-edited", "hybrid"]),
  changes: z.array(
    z.object({
      section: z.string().min(1),
      changeType: z.enum(["added", "removed", "rephrased", "reordered"]),
      originalText: z.string().min(1),
      modifiedText: z.string().min(1),
      reason: z.string().min(1)
    })
  ),
  modifiedResumeData: parsedResumeDataSchema,
  status: z.enum(["draft", "finalized", "applied"]).default("draft")
});

export const createApplicationSchema = z.object({
  userId: z.string().min(1),
  resumeId: z.string().min(1),
  jobMatchId: z.string().min(1),
  finalATSScore: z.number().min(0).max(100),
  applicationStatus: z.enum(["applied", "screening", "interview", "offer", "rejected", "accepted", "declined"]),
  statusHistory: z.array(
    z.object({
      status: z.enum(["applied", "screening", "interview", "offer", "rejected", "accepted", "declined"]),
      updatedAt: isoDate,
      notes: z.string().optional()
    })
  ),
  interviewDetails: z.array(
    z.object({
      round: z.number().int().positive(),
      type: z.enum(["phone", "technical", "behavioral", "final"]),
      scheduledAt: isoDate,
      completedAt: isoDate.optional(),
      feedback: z.string().optional()
    })
  ),
  notes: z.string().optional(),
  followUpDate: isoDate.optional()
});

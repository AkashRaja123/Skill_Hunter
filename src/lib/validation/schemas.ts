import { z } from "zod";

const isoDate = z.string().datetime().or(z.string().min(1));

const cleanOptionalString = z.preprocess(
  (value) => (typeof value === "string" ? value.trim() : value),
  z.string().optional()
);

const optionalUrl = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().url().optional()
);

const stringList = z.preprocess(
  (value) => {
    if (Array.isArray(value)) {
      return value
        .map((item) => String(item).trim())
        .filter(Boolean);
    }

    if (typeof value === "string") {
      return value
        .split(/[\n,;]+/)
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return [];
  },
  z.array(z.string())
);

const proficiencySchema = z.preprocess((value) => {
  if (typeof value !== "string") {
    return "intermediate";
  }

  const normalized = value.toLowerCase().trim();
  if (["expert", "advanced", "senior", "proficient"].some((token) => normalized.includes(token))) {
    return "expert";
  }

  if (["beginner", "basic", "novice", "entry"].some((token) => normalized.includes(token))) {
    return "beginner";
  }

  return "intermediate";
}, z.enum(["beginner", "intermediate", "expert"]));

const scoreSchema = z.preprocess((value) => {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const match = value.match(/\d+/);
    return match ? Number(match[0]) : 0;
  }

  return 0;
}, z.number().min(0).max(100));

const parsedResumeDataSchema = z.object({
  personalInfo: z.object({
    name: z.preprocess(
      (value) => (typeof value === "string" ? value.trim() : ""),
      z.string()
    ).transform((value) => value || "Unknown Candidate"),
    email: z.preprocess(
      (value) => (typeof value === "string" ? value.trim() : ""),
      z.string()
    ).transform((value) => value || "not-provided@example.com"),
    phone: cleanOptionalString,
    location: cleanOptionalString,
    linkedin: cleanOptionalString,
    portfolio: cleanOptionalString
  }),
  skills: z.array(
    z.object({
      skillName: z.preprocess(
        (value) => (typeof value === "string" ? value.trim() : ""),
        z.string()
      ).transform((value) => value || "Unknown Skill"),
      category: z.preprocess(
        (value) => (typeof value === "string" ? value.trim() : "other"),
        z.string()
      ).transform((value) => value || "other"),
      proficiency: proficiencySchema
    })
  ).default([]),
  experience: z.array(
    z.object({
      company: z.preprocess(
        (value) => (typeof value === "string" ? value.trim() : ""),
        z.string()
      ).transform((value) => value || "Not specified"),
      position: z.preprocess(
        (value) => (typeof value === "string" ? value.trim() : ""),
        z.string()
      ).transform((value) => value || "Not specified"),
      startDate: z.preprocess(
        (value) => (typeof value === "string" ? value.trim() : ""),
        z.string()
      ).transform((value) => value || "Not specified"),
      endDate: z.preprocess(
        (value) => (typeof value === "string" ? value.trim() : ""),
        z.string()
      ).transform((value) => value || "Not specified"),
      description: z.preprocess(
        (value) => (typeof value === "string" ? value.trim() : ""),
        z.string()
      ).transform((value) => value || "Not specified"),
      achievements: stringList.default([])
    })
  ).default([]),
  education: z.array(
    z.object({
      institution: z.preprocess(
        (value) => (typeof value === "string" ? value.trim() : ""),
        z.string()
      ).transform((value) => value || "Not specified"),
      degree: z.preprocess(
        (value) => (typeof value === "string" ? value.trim() : ""),
        z.string()
      ).transform((value) => value || "Not specified"),
      field: z.preprocess(
        (value) => (typeof value === "string" ? value.trim() : ""),
        z.string()
      ).transform((value) => value || "Not specified"),
      graduationDate: z.preprocess(
        (value) => (typeof value === "string" ? value.trim() : ""),
        z.string()
      ).transform((value) => value || "Not specified"),
      gpa: cleanOptionalString
    })
  ).default([]),
  certifications: z.array(
    z.object({
      name: z.preprocess(
        (value) => (typeof value === "string" ? value.trim() : ""),
        z.string()
      ).transform((value) => value || "Not specified"),
      issuer: z.preprocess(
        (value) => (typeof value === "string" ? value.trim() : ""),
        z.string()
      ).transform((value) => value || "Not specified"),
      dateObtained: z.preprocess(
        (value) => (typeof value === "string" ? value.trim() : ""),
        z.string()
      ).transform((value) => value || "Not specified"),
      expiryDate: cleanOptionalString
    })
  ).default([]),
  projects: z.array(
    z.object({
      name: z.preprocess(
        (value) => (typeof value === "string" ? value.trim() : ""),
        z.string()
      ).transform((value) => value || "Not specified"),
      description: z.preprocess(
        (value) => (typeof value === "string" ? value.trim() : ""),
        z.string()
      ).transform((value) => value || "Not specified"),
      technologies: stringList.default([]),
      url: optionalUrl
    })
  ).default([])
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
    strengthAreas: stringList.default([]),
    improvementAreas: stringList.default([]),
    suggestedJobRoles: stringList.default([]),
    overallQuality: scoreSchema
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

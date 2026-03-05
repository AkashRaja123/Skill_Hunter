export type Id = string;
export type Timestamp = string;

export interface UserMetadata {
  totalResumesUploaded: number;
  totalJobsApplied: number;
  averageATSScore: number;
}

export interface User {
  userId: Id;
  email: string;
  displayName: string;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
  profileComplete: boolean;
  metadata: UserMetadata;
}

export interface ResumeSkill {
  skillName: string;
  category: string;
  proficiency: "beginner" | "intermediate" | "expert";
}

export interface ResumeExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string[];
}

export interface ResumeEducation {
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
  gpa?: string;
}

export interface ResumeCertification {
  name: string;
  issuer: string;
  dateObtained: string;
  expiryDate?: string;
}

export interface ResumeProject {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}

export interface ParsedResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    portfolio?: string;
  };
  skills: ResumeSkill[];
  experience: ResumeExperience[];
  education: ResumeEducation[];
  certifications: ResumeCertification[];
  projects: ResumeProject[];
}

export interface AIAnalysis {
  strengthAreas: string[];
  improvementAreas: string[];
  suggestedJobRoles: string[];
  overallQuality: number;
}

export interface Resume {
  resumeId: Id;
  userId: Id;
  uploadedAt: Timestamp;
  lastModifiedAt: Timestamp;
  parsedData: ParsedResumeData;
  aiAnalysis: AIAnalysis;
}

export interface JobMatch {
  jobMatchId: Id;
  userId: Id;
  resumeId: Id;
  jobDetails: {
    title: string;
    company: string;
    location: string;
    jobType: "full-time" | "part-time" | "contract" | "remote";
    experienceLevel: "entry" | "mid" | "senior" | "lead";
    salary: {
      min: number;
      max: number;
      currency: string;
    };
    description: string;
    requirements: string[];
    responsibilities: string[];
    benefits: string[];
    sourceUrl: string;
    postedDate: Timestamp;
  };
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  fetchedAt: Timestamp;
  isBookmarked: boolean;
  status: "suggested" | "selected" | "applied" | "rejected";
}

export interface ATSSuggestion {
  category: "keywords" | "format" | "experience" | "skills";
  priority: "high" | "medium" | "low";
  issue: string;
  recommendation: string;
  exampleText?: string;
}

export interface ATSScore {
  atsScoreId: Id;
  userId: Id;
  resumeId: Id;
  jobMatchId: Id;
  score: number;
  calculatedAt: Timestamp;
  version: number;
  scoreBreakdown: {
    keywordMatch: number;
    formatCompliance: number;
    experienceMatch: number;
    skillsMatch: number;
    educationMatch: number;
  };
  suggestions: ATSSuggestion[];
  previousScore?: number;
  improvement?: number;
  passedThreshold: boolean;
}

export interface ResumeChange {
  section: string;
  changeType: "added" | "removed" | "rephrased" | "reordered";
  originalText: string;
  modifiedText: string;
  reason: string;
}

export interface ResumeModification {
  modificationId: Id;
  userId: Id;
  originalResumeId: Id;
  jobMatchId: Id;
  atsScoreId: Id;
  modifiedAt: Timestamp;
  modificationType: "ai-suggested" | "user-edited" | "hybrid";
  changes: ResumeChange[];
  modifiedResumeData: ParsedResumeData;
  status: "draft" | "finalized" | "applied";
}

export interface ApplicationStatusEvent {
  status: "applied" | "screening" | "interview" | "offer" | "rejected" | "accepted" | "declined";
  updatedAt: Timestamp;
  notes?: string;
}

export interface InterviewDetail {
  round: number;
  type: "phone" | "technical" | "behavioral" | "final";
  scheduledAt: Timestamp;
  completedAt?: Timestamp;
  feedback?: string;
}

export interface Application {
  applicationId: Id;
  userId: Id;
  resumeId: Id;
  jobMatchId: Id;
  appliedAt: Timestamp;
  finalATSScore: number;
  applicationStatus: "applied" | "screening" | "interview" | "offer" | "rejected" | "accepted" | "declined";
  statusHistory: ApplicationStatusEvent[];
  interviewDetails: InterviewDetail[];
  notes?: string;
  followUpDate?: Timestamp;
}

export interface ListFilters {
  userId?: string;
  resumeId?: string;
  jobMatchId?: string;
  status?: string;
}

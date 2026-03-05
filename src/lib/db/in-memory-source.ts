import type { DataSource } from "@/lib/db/data-source";
import type {
  Application,
  ATSScore,
  JobMatch,
  ListFilters,
  Resume,
  ResumeModification,
  User
} from "@/lib/db/types";

function filterBy<T extends Record<string, unknown>>(items: T[], filters?: ListFilters): T[] {
  if (!filters) return items;
  return items.filter((item) => {
    if (filters.userId && item.userId !== filters.userId) return false;
    if (filters.resumeId && item.resumeId !== filters.resumeId) return false;
    if (filters.jobMatchId && item.jobMatchId !== filters.jobMatchId) return false;
    if (filters.status && item.status !== filters.status && item.applicationStatus !== filters.status) return false;
    return true;
  });
}

export class InMemoryDataSource implements DataSource {
  private readonly users = new Map<string, User>();
  private readonly resumes = new Map<string, Resume>();
  private readonly jobMatches = new Map<string, JobMatch>();
  private readonly atsScores = new Map<string, ATSScore>();
  private readonly resumeModifications = new Map<string, ResumeModification>();
  private readonly applications = new Map<string, Application>();

  async listUsers(filters?: ListFilters): Promise<User[]> {
    return filterBy(Array.from(this.users.values()), filters);
  }

  async createUser(input: User): Promise<User> {
    this.users.set(input.userId, input);
    return input;
  }

  async listResumes(filters?: ListFilters): Promise<Resume[]> {
    const items = filterBy(Array.from(this.resumes.values()), filters);
    return items.sort((a, b) => a.uploadedAt.localeCompare(b.uploadedAt) * -1);
  }

  async createResume(input: Resume): Promise<Resume> {
    this.resumes.set(input.resumeId, input);
    return input;
  }

  async listJobMatches(filters?: ListFilters): Promise<JobMatch[]> {
    const items = filterBy(Array.from(this.jobMatches.values()), filters);
    return items.sort((a, b) => b.matchScore - a.matchScore);
  }

  async createJobMatch(input: JobMatch): Promise<JobMatch> {
    this.jobMatches.set(input.jobMatchId, input);
    return input;
  }

  async listATSScores(filters?: ListFilters): Promise<ATSScore[]> {
    const items = filterBy(Array.from(this.atsScores.values()), filters);
    return items.sort((a, b) => a.version - b.version);
  }

  async createATSScore(input: ATSScore): Promise<ATSScore> {
    this.atsScores.set(input.atsScoreId, input);
    return input;
  }

  async listResumeModifications(filters?: ListFilters): Promise<ResumeModification[]> {
    const items = filterBy(Array.from(this.resumeModifications.values()), filters);
    return items.sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt));
  }

  async createResumeModification(input: ResumeModification): Promise<ResumeModification> {
    this.resumeModifications.set(input.modificationId, input);
    return input;
  }

  async listApplications(filters?: ListFilters): Promise<Application[]> {
    const items = filterBy(Array.from(this.applications.values()), filters);
    return items.sort((a, b) => b.appliedAt.localeCompare(a.appliedAt));
  }

  async createApplication(input: Application): Promise<Application> {
    this.applications.set(input.applicationId, input);
    return input;
  }
}

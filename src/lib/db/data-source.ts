import type {
  Application,
  ATSScore,
  JobMatch,
  ListFilters,
  Resume,
  ResumeModification,
  User
} from "@/lib/db/types";

export interface DataSource {
  listUsers(filters?: ListFilters): Promise<User[]>;
  createUser(input: User): Promise<User>;

  listResumes(filters?: ListFilters): Promise<Resume[]>;
  createResume(input: Resume): Promise<Resume>;

  listJobMatches(filters?: ListFilters): Promise<JobMatch[]>;
  createJobMatch(input: JobMatch): Promise<JobMatch>;

  listATSScores(filters?: ListFilters): Promise<ATSScore[]>;
  createATSScore(input: ATSScore): Promise<ATSScore>;

  listResumeModifications(filters?: ListFilters): Promise<ResumeModification[]>;
  createResumeModification(input: ResumeModification): Promise<ResumeModification>;

  listApplications(filters?: ListFilters): Promise<Application[]>;
  createApplication(input: Application): Promise<Application>;
  updateApplication(applicationId: string, updates: Partial<Application>): Promise<Application>;
}

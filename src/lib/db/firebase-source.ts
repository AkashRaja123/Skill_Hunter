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

// Firebase integration is intentionally deferred.
// Implement Firestore reads/writes here and keep route handlers unchanged.
export class FirebaseDataSource implements DataSource {
  private static notReady(): never {
    throw new Error("Firebase data source is not configured yet. Set USE_FIREBASE=false until implementation is added.");
  }

  async listUsers(_filters?: ListFilters): Promise<User[]> {
    FirebaseDataSource.notReady();
  }

  async createUser(_input: User): Promise<User> {
    FirebaseDataSource.notReady();
  }

  async listResumes(_filters?: ListFilters): Promise<Resume[]> {
    FirebaseDataSource.notReady();
  }

  async createResume(_input: Resume): Promise<Resume> {
    FirebaseDataSource.notReady();
  }

  async listJobMatches(_filters?: ListFilters): Promise<JobMatch[]> {
    FirebaseDataSource.notReady();
  }

  async createJobMatch(_input: JobMatch): Promise<JobMatch> {
    FirebaseDataSource.notReady();
  }

  async listATSScores(_filters?: ListFilters): Promise<ATSScore[]> {
    FirebaseDataSource.notReady();
  }

  async createATSScore(_input: ATSScore): Promise<ATSScore> {
    FirebaseDataSource.notReady();
  }

  async listResumeModifications(_filters?: ListFilters): Promise<ResumeModification[]> {
    FirebaseDataSource.notReady();
  }

  async createResumeModification(_input: ResumeModification): Promise<ResumeModification> {
    FirebaseDataSource.notReady();
  }

  async listApplications(_filters?: ListFilters): Promise<Application[]> {
    FirebaseDataSource.notReady();
  }

  async createApplication(_input: Application): Promise<Application> {
    FirebaseDataSource.notReady();
  }
}

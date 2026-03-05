import { getDataSource } from "@/lib/db";
import {
  dummyUsers,
  dummyResumes,
  dummyJobMatches,
  dummyApplications,
  dummyATSScores,
} from "./dummy-data";

/**
 * Seeds the database with dummy data for testing/demo purposes
 * Call this function to populate the HR dashboard with sample job seekers
 */
export async function seedDummyData() {
  const ds = getDataSource();

  try {
    // Clear existing data (optional - remove if you want to preserve existing data)
    // await ds.clearAllData();

    // Seed users
    console.log("Seeding users...");
    for (const user of dummyUsers) {
      await ds.createUser(user);
    }

    // Seed resumes
    console.log("Seeding resumes...");
    for (const resume of dummyResumes) {
      await ds.createResume(resume);
    }

    // Seed job matches
    console.log("Seeding job matches...");
    for (const match of dummyJobMatches) {
      await ds.createJobMatch(match);
    }

    // Seed applications
    console.log("Seeding applications...");
    for (const app of dummyApplications) {
      await ds.createApplication(app);
    }

    // Seed ATS scores
    console.log("Seeding ATS scores...");
    for (const atsScore of dummyATSScores) {
      await ds.createATSScore(atsScore);
    }

    console.log("✓ Dummy data seeding completed successfully!");
    return { success: true, message: "Dummy data seeded successfully" };
  } catch (error) {
    console.error("Error seeding dummy data:", error);
    throw error;
  }
}

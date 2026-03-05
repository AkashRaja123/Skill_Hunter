import { env } from "@/lib/config/env";
import { FirebaseDataSource } from "@/lib/db/firebase-source";
import { InMemoryDataSource } from "@/lib/db/in-memory-source";

declare global {
  // eslint-disable-next-line no-var
  var __skillHunterDataSource: FirebaseDataSource | InMemoryDataSource | undefined;
}

export function getDataSource() {
  if (!globalThis.__skillHunterDataSource) {
    globalThis.__skillHunterDataSource = env.useFirebase ? new FirebaseDataSource() : new InMemoryDataSource();
  }

  return globalThis.__skillHunterDataSource;
}

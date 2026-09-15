import { env } from "@/lib/config/env";
import type { JobSearchResult } from "@/lib/db/types";

const ADZUNA_BASE_URL = "https://api.adzuna.com/v1/api/jobs";

interface AdzunaResult {
  id?: string;
  title?: string;
  company?: { display_name?: string };
  location?: { display_name?: string };
  description?: string;
  salary_min?: number;
  salary_max?: number;
  contract_type?: string;
  redirect_url?: string;
  created?: string;
}

interface AdzunaResponse {
  results?: AdzunaResult[];
}

export async function fetchJobsForRole(
  role: string,
  location?: string,
  country = "in",
  resultsPerPage = 10
): Promise<JobSearchResult[]> {
  const params = new URLSearchParams({
    app_id: env.adzunaAppId,
    app_key: env.adzunaAppKey,
    what: role,
    results_per_page: String(resultsPerPage)
  });

  if (location) {
    params.set("where", location);
  }

  const url = `${ADZUNA_BASE_URL}/${encodeURIComponent(country)}/search/1?${params.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Adzuna API error (${response.status}): ${errorText}`);
  }

  const data: AdzunaResponse = await response.json();

  if (!data.results || data.results.length === 0) {
    return [];
  }

  return data.results.map((job, index) => ({
    id: String(job.id ?? `adzuna-${index}`),
    title: job.title ?? "Untitled",
    company: job.company?.display_name ?? "Unknown Company",
    location: job.location?.display_name ?? "Not specified",
    description: job.description ?? "",
    salaryMin: job.salary_min,
    salaryMax: job.salary_max,
    jobType: job.contract_type,
    jobUrl: job.redirect_url,
    postedDate: job.created
  }));
}

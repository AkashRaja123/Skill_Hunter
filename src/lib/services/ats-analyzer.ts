import { env } from "@/lib/config/env";
import type { ParsedResumeData, ATSAnalysisResult } from "@/lib/db/types";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

interface OpenRouterResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

const ATS_ANALYSIS_PROMPT = `You are an expert ATS (Applicant Tracking System) analyzer.

Given a candidate's resume data and a job posting, analyze how well the resume matches the job and return a detailed ATS compatibility report.

Return ONLY a valid JSON object with this exact structure:

{
  "score": number (0-100, overall ATS compatibility score),
  "scoreBreakdown": {
    "keywordMatch": number (0-100),
    "formatCompliance": number (0-100),
    "experienceMatch": number (0-100),
    "skillsMatch": number (0-100),
    "educationMatch": number (0-100)
  },
  "suggestions": [
    {
      "category": "keywords" | "format" | "experience" | "skills",
      "priority": "high" | "medium" | "low",
      "issue": "string describing the problem",
      "recommendation": "string with actionable fix",
      "exampleText": "optional example text to use"
    }
  ],
  "resumeEnhancement": {
    "keywordsToAdd": ["keyword1", "keyword2"],
    "phrasesToUse": ["action phrase 1", "action phrase 2"],
    "sectionsToUpdate": ["section name: what to change"]
  },
  "skillsGap": {
    "missingSkills": [
      {
        "skill": "skill name",
        "importance": "critical" | "recommended" | "nice-to-have"
      }
    ],
    "timeToLearn": "estimated time to learn missing critical skills"
  }
}

Rules:
- Return ONLY valid JSON (no markdown, no explanations).
- Score should reflect real ATS compatibility — be honest, not generous.
- keywordsToAdd: specific keywords from the job description missing in the resume.
- phrasesToUse: action-oriented phrases that would strengthen the resume for this role.
- sectionsToUpdate: specific sections and what to change (e.g., "Summary: Add mention of X technology").
- missingSkills: skills required by the job that the candidate lacks. Mark importance accurately.
- timeToLearn: rough estimate like "2-3 months" for critical missing skills.
- Provide at least 3 suggestions with actionable recommendations.`;

export async function analyzeResumeVsJob(
  parsedData: ParsedResumeData,
  jobTitle: string,
  jobDescription: string
): Promise<ATSAnalysisResult> {
  const userContent = `
## Resume Data
${JSON.stringify(parsedData, null, 2)}

## Job Title
${jobTitle}

## Job Description
${jobDescription}
`;

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.openRouterApiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": env.openRouterSiteUrl ?? "http://localhost:3000",
      "X-Title": env.openRouterAppName
    },
    body: JSON.stringify({
      model: env.openRouterModel,
      messages: [
        { role: "system", content: ATS_ANALYSIS_PROMPT },
        { role: "user", content: userContent }
      ],
      temperature: 0.2,
      top_p: 0.95,
      max_tokens: 4096
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`OpenRouter API error: ${JSON.stringify(errorData)}`);
  }

  const data: OpenRouterResponse = await response.json();
  const generatedText = data.choices?.[0]?.message?.content;

  if (!generatedText) {
    throw new Error("No response from OpenRouter API for ATS analysis");
  }

  let jsonText = generatedText.trim();
  if (jsonText.startsWith("```json")) {
    jsonText = jsonText.replace(/```json\n?/, "").replace(/\n?```$/, "");
  } else if (jsonText.startsWith("```")) {
    jsonText = jsonText.replace(/```\n?/, "").replace(/\n?```$/, "");
  }

  const parsed = JSON.parse(jsonText);
  const score = typeof parsed.score === "number" ? parsed.score : 0;

  return {
    score,
    passedThreshold: score >= 85,
    scoreBreakdown: parsed.scoreBreakdown ?? {
      keywordMatch: 0,
      formatCompliance: 0,
      experienceMatch: 0,
      skillsMatch: 0,
      educationMatch: 0
    },
    suggestions: parsed.suggestions ?? [],
    resumeEnhancement: {
      keywordsToAdd: parsed.resumeEnhancement?.keywordsToAdd ?? [],
      phrasesToUse: parsed.resumeEnhancement?.phrasesToUse ?? [],
      sectionsToUpdate: parsed.resumeEnhancement?.sectionsToUpdate ?? []
    },
    skillsGap: {
      missingSkills: parsed.skillsGap?.missingSkills ?? [],
      timeToLearn: parsed.skillsGap?.timeToLearn
    }
  };
}

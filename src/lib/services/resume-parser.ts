import { env } from "@/lib/config/env";
import type { ParsedResumeData, AIAnalysis } from "@/lib/db/types";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

interface OpenRouterResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

const PARSING_PROMPT = `You are an expert resume parser and career analyst.

Your task is to analyze the provided resume text, extract structured information, and determine the most suitable job roles for the candidate.

Return ONLY a valid JSON object with this exact structure:

{
  "parsedData": {
    "personalInfo": {
      "name": "string",
      "email": "string",
      "phone": "string or empty",
      "location": "string or empty",
      "linkedin": "string or empty",
      "portfolio": "string or empty"
    },
    "skills": [
      {
        "skillName": "string",
        "category": "technical|soft|language|other",
        "proficiency": "beginner|intermediate|expert"
      }
    ],
    "experience": [
      {
        "company": "string",
        "position": "string",
        "startDate": "YYYY-MM or YYYY",
        "endDate": "YYYY-MM or YYYY or present",
        "description": "string",
        "achievements": ["string"]
      }
    ],
    "education": [
      {
        "institution": "string",
        "degree": "string",
        "field": "string",
        "graduationDate": "YYYY-MM or YYYY",
        "gpa": "string or empty"
      }
    ],
    "certifications": [
      {
        "name": "string",
        "issuer": "string",
        "dateObtained": "YYYY-MM or YYYY",
        "expiryDate": "YYYY-MM or YYYY or empty"
      }
    ],
    "projects": [
      {
        "name": "string",
        "description": "string",
        "technologies": ["string"],
        "url": "string or empty"
      }
    ]
  },
  "aiAnalysis": {
    "strengthAreas": ["string"],
    "improvementAreas": ["string"],
    "suggestedJobRoles": ["string"],
    "bestSuitableRole": "string",
    "roleJustification": "string",
    "overallQuality": number between 0-100
  }
}

Rules:
- Return ONLY valid JSON (no markdown, no explanations).
- If a field is missing, use an empty string "" or empty array [].
- Extract all skills mentioned, including technical, soft, and language skills.
- Infer skill proficiency based on experience, role titles, and context.
- Extract bullet points from experience sections as achievements.
- Identify 3–5 suggestedJobRoles based on skills, projects, and experience.
- Determine the single most suitable role in "bestSuitableRole".
- Provide a short explanation in "roleJustification" explaining why this role fits the candidate.
- Score "overallQuality" from 0–100 based on clarity, completeness, measurable achievements, and formatting.`;

export async function parseResumeWithOpenRouter(resumeText: string): Promise<{
  parsedData: ParsedResumeData;
  aiAnalysis: AIAnalysis;
}> {
  try {
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
          {
            role: "system",
            content: PARSING_PROMPT
          },
          {
            role: "user",
            content: resumeText
          }
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
      throw new Error("No response from OpenRouter API");
    }

    // Extract JSON from markdown code blocks if present
    let jsonText = generatedText.trim();
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/```json\n?/, "").replace(/\n?```$/, "");
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/```\n?/, "").replace(/\n?```$/, "");
    }

    const parsed = JSON.parse(jsonText);

    return {
      parsedData: parsed.parsedData,
      aiAnalysis: parsed.aiAnalysis
    };
  } catch (error) {
    console.error("Resume parsing error:", error);
    throw new Error(
      error instanceof Error ? `Failed to parse resume: ${error.message}` : "Failed to parse resume"
    );
  }
}

export async function extractTextFromPDF(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    // Dynamic import for server-side only
    const pdfParse = (await import("pdf-parse")).default;
    const buffer = Buffer.from(arrayBuffer);
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export function extractTextFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const result = event.target?.result;
        
        if (!result) {
          reject(new Error("Failed to read file"));
          return;
        }

        let text: string;

        // Handle PDF files
        if (file.type === "application/pdf") {
          text = await extractTextFromPDF(result as ArrayBuffer);
        } else {
          // Handle text files
          text = result as string;
        }

        if (!text || text.trim().length === 0) {
          reject(new Error("File is empty or could not be read"));
          return;
        }

        resolve(text);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    // Read as ArrayBuffer for PDFs, as text for others
    if (file.type === "application/pdf") {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  });
}

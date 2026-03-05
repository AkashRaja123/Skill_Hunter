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

const PARSING_PROMPT = `You are an expert resume parser. Extract structured data from the following resume text and return ONLY a valid JSON object with this exact structure:

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
    "overallQuality": number between 0-100
  }
}

Rules:
- Return ONLY valid JSON, no markdown, no explanations
- If a field is missing, use empty string or empty array
- Infer proficiency levels based on context (years of experience, role seniority)
- Extract all skills mentioned (technical, soft, languages)
- For achievements, extract bullet points from experience sections
- For overallQuality, score based on: clarity, completeness, impact statements, formatting
- strengthAreas should highlight what stands out positively
- improvementAreas should note missing elements or weak points
- suggestedJobRoles should list 3-5 best-fit roles based on skills and experience
`;

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

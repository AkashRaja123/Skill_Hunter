import { env } from "@/lib/config/env";
import { nanoid } from "nanoid";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

const APTITUDE_FALLBACK_QUESTIONS: QuizQuestion[] = [
  {
    id: "apt-1",
    question: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
    options: ["120 metres", "180 metres", "324 metres", "150 metres"],
    correctAnswer: 3,
    explanation: "Speed = 60 * (5/18) = 50/3 m/sec. Length of Train = Speed * Time = (50/3) * 9 = 150 metres.",
    difficulty: "easy"
  },
  {
    id: "apt-2",
    question: "If a person sells an article for $650 at a profit of 30%, what was the cost price of the article?",
    options: ["$500", "$480", "$520", "$450"],
    correctAnswer: 0,
    explanation: "Cost Price = (Selling Price * 100) / (100 + Profit%) = (650 * 100) / 130 = $500.",
    difficulty: "easy"
  },
  {
    id: "apt-3",
    question: "A and B together can do a piece of work in 12 days, which B alone can do in 30 days. In how many days can A alone finish the work?",
    options: ["18 days", "20 days", "22 days", "24 days"],
    correctAnswer: 1,
    explanation: "A's 1 day work = (1/12) - (1/30) = (5 - 2)/60 = 3/60 = 1/20. Therefore, A alone can finish in 20 days.",
    difficulty: "medium"
  },
  {
    id: "apt-4",
    question: "Find the next number in the series: 3, 7, 15, 31, 63, ?",
    options: ["127", "125", "128", "131"],
    correctAnswer: 0,
    explanation: "Each number is multiplied by 2 and then 1 is added: (63 * 2) + 1 = 126 + 1 = 127.",
    difficulty: "medium"
  },
  {
    id: "apt-5",
    question: "In a family, a couple has 5 married sons and each son has 4 children. How many members are there in the family?",
    options: ["30", "32", "28", "34"],
    correctAnswer: 1,
    explanation: "Couple (2) + 5 sons and their wives (5 * 2 = 10) + grandchildren (5 * 4 = 20) = 2 + 10 + 20 = 32 members.",
    difficulty: "hard"
  }
];

const VERBAL_FALLBACK_QUESTIONS: QuizQuestion[] = [
  {
    id: "vrb-1",
    question: "Choose the word that is most nearly OPPOSITE in meaning to 'METICULOUS':",
    options: ["Careless", "Thorough", "Detailed", "Scrupulous"],
    correctAnswer: 0,
    explanation: "Meticulous means showing great attention to detail or very careful. The opposite is Careless.",
    difficulty: "easy"
  },
  {
    id: "vrb-2",
    question: "Select the sentence with correct subject-verb agreement:",
    options: [
      "The list of items are on the desk.",
      "The list of items is on the desk.",
      "The list of items were on the desk.",
      "The list of items have been on the desk."
    ],
    correctAnswer: 1,
    explanation: "The subject is 'The list' (singular), so the singular verb 'is' is correct.",
    difficulty: "easy"
  },
  {
    id: "vrb-3",
    question: "Identify the correct idiom meaning: 'To burn the candle at both ends'",
    options: [
      "To be overly wasteful with energy",
      "To work excessively hard from early morning until late at night",
      "To illuminate a dark room effectively",
      "To make a quick decision without thinking"
    ],
    correctAnswer: 1,
    explanation: "'To burn the candle at both ends' means to exhaust oneself by working long hours without adequate rest.",
    difficulty: "medium"
  },
  {
    id: "vrb-4",
    question: "Choose the word that best fits the blank: 'Her argument was so ______ that even her strongest opponents had to concede.'",
    options: ["ambiguous", "cogent", "redundant", "pedantic"],
    correctAnswer: 1,
    explanation: "'Cogent' means clear, logical, and convincing.",
    difficulty: "medium"
  },
  {
    id: "vrb-5",
    question: "Which of the following sentences contains a dangling modifier?",
    options: [
      "Walking down the street, the trees were beautiful.",
      "Walking down the street, I admired the beautiful trees.",
      "As I walked down the street, the trees were beautiful.",
      "While walking down the street, she noticed the trees."
    ],
    correctAnswer: 0,
    explanation: "In 'Walking down the street, the trees were beautiful', the modifier 'Walking down the street' illogically attaches to 'the trees', making it seem the trees are walking.",
    difficulty: "hard"
  }
];

interface OpenRouterResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

export async function generateQuizQuestions(
  type: "aptitude" | "verbal",
  count = 5
): Promise<QuizQuestion[]> {
  const prompt = `You are an expert interview assessment and test creator for software and technical job candidates.
Generate ${count} diverse and realistic multiple-choice ${type === "aptitude" ? "Quantitative & Logical Aptitude" : "Verbal Ability, Grammar & Reading Comprehension"} questions for interview preparation.

Return ONLY a valid JSON array of objects with this EXACT format:
[
  {
    "id": "string",
    "question": "Clear problem statement",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Detailed step-by-step solution and explanation",
    "difficulty": "easy" | "medium" | "hard"
  }
]

Rules:
- Exactly 4 options per question.
- "correctAnswer" MUST be the 0-indexed integer corresponding to the correct option in "options" (0, 1, 2, or 3).
- Include varied difficulty (easy, medium, hard).
- Return ONLY the raw JSON array. No markdown code blocks, no conversational text.`;

  const modelsToTry = [env.openRouterModel];
  if (env.openRouterFallbackModel && env.openRouterFallbackModel !== env.openRouterModel) {
    modelsToTry.push(env.openRouterFallbackModel);
  }

  for (const model of modelsToTry) {
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
          model,
          messages: [
            {
              role: "system",
              content: "You are a specialized test question generator. Always respond in valid JSON format."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 3000
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter error status: ${response.status}`);
      }

      const data: OpenRouterResponse = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error("Empty response from OpenRouter");
      }

      let cleaned = content.trim();
      if (cleaned.startsWith("```json")) {
        cleaned = cleaned.replace(/^```json\n?/, "").replace(/\n?```$/, "");
      } else if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```\n?/, "").replace(/\n?```$/, "");
      }

      const parsed = JSON.parse(cleaned);

      if (Array.isArray(parsed) && parsed.length > 0) {
        const validated: QuizQuestion[] = parsed.map((item, index) => ({
          id: item.id || `${type}-${index + 1}-${nanoid(4)}`,
          question: String(item.question || ""),
          options: Array.isArray(item.options) && item.options.length === 4
            ? item.options.map(String)
            : ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: typeof item.correctAnswer === "number" && item.correctAnswer >= 0 && item.correctAnswer <= 3
            ? item.correctAnswer
            : 0,
          explanation: String(item.explanation || "No explanation provided."),
          difficulty: item.difficulty === "easy" || item.difficulty === "medium" || item.difficulty === "hard"
            ? item.difficulty
            : "medium"
        }));

        return validated;
      }
    } catch (err) {
      console.warn(`[Quiz Generator] Failed with model ${model}:`, err);
    }
  }

  // If AI generation fails, return the curated question bank with random IDs
  const fallbackList = type === "aptitude" ? APTITUDE_FALLBACK_QUESTIONS : VERBAL_FALLBACK_QUESTIONS;
  return fallbackList.map(q => ({
    ...q,
    id: `${q.id}-${nanoid(4)}`
  }));
}

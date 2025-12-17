import { GoogleGenAI, Type } from "@google/genai";
import { Book, AIRecommendationResponse } from "../types";

// Access the API key injected by Vite build process
const API_KEY = import.meta.env.VITE_API_KEY;

// Use the key if available, otherwise it might fail at runtime if not configured in Netlify
const ai = new GoogleGenAI({ apiKey: API_KEY || "" });

const modelId = "gemini-2.5-flash";

export const generateBookDescription = async (
  title: string,
  author: string,
  category: string,
  subcategory: string
): Promise<string> => {
  if (!API_KEY) {
    console.warn("API Key is missing. AI features will not work.");
    return "API 키가 설정되지 않아 설명을 생성할 수 없습니다.";
  }

  const prompt = `
    당신은 건설 분야 전문 도서 및 문서의 전문 카피라이터입니다.
    다음 문서 정보를 바탕으로 구매자의 필요성을 자극하는 명확하고 신뢰감 있는 소개글을 작성해주세요.

    문서 제목: ${title}
    작성자: ${author}
    카테고리: ${category}
    세부 분류: ${subcategory}

    요구사항:
    1. 3~4문장의 전문적이고 정중한 한국어로 작성할 것.
    2. 실무에 어떻게 도움이 되는지 구체적인 효용을 강조할 것.
    3. 건설/안전 관련 적절한 이모지를 1~2개 포함할 것.
    4. 신뢰감을 주는 어조를 사용할 것.
  `;

  try {
    const result = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    return result.text || "설명을 생성할 수 없습니다.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const getAIRecommendations = async (
  query: string,
  books: Book[]
): Promise<AIRecommendationResponse> => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const booksList = books.map(b => 
    `ID: ${b.id}, 제목: ${b.title}, 저자: ${b.author}, 카테고리: ${b.category} > ${b.subcategory}, 설명: ${b.description}`
  ).join("\n");

  const prompt = `
    사용자의 요청에 맞춰 다음 건설 관련 도서/문서 목록 중에서 가장 적절한 자료를 추천해주세요.
    
    사용자 요청: "${query}"

    자료 목록:
    ${booksList}
  `;

  try {
    const result = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  bookId: { type: Type.INTEGER },
                  reason: { type: Type.STRING },
                },
                required: ["bookId", "reason"],
              },
            },
            summary: {
              type: Type.STRING,
            },
          },
          required: ["recommendations", "summary"],
        },
      },
    });

    if (result.text) {
      return JSON.parse(result.text) as AIRecommendationResponse;
    }
    throw new Error("No response text");

  } catch (error) {
    console.error("Gemini API Error (Recommendations):", error);
    throw error;
  }
};
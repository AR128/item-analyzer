import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing. Add it to backend/.env");
}

const ai = new GoogleGenAI({
  apiKey,
});

export async function identifyItem(imageBuffer, mimeType) {
  const prompt = `
Identify the main physical item in this image.

This is for a railway luggage checking application.

Important:
- Identify the object only.
- Do NOT decide whether it is allowed on a train.
- If you cannot confidently identify the object, return "unknown".
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",

    contents: [
      {
        text: prompt,
      },
      {
        inlineData: {
          mimeType,
          data: imageBuffer.toString("base64"),
        },
      },
    ],

    config: {
      responseMimeType: "application/json",

      responseSchema: {
        type: "object",

        properties: {
          item: {
            type: "string",
          },

          category: {
            type: "string",
          },

          confidence: {
            type: "number",
          },
        },

        required: ["item", "category", "confidence"],
      },
    },
  });

  return JSON.parse(response.text);
}

// src\utils\openaiService.ts
import { openai } from "../config/openaiClient";
import { BookSearchError } from "../errors/Errors";

export const extractBookData = async (text: string) => {
  console.log(`🧠 Intent: text`, text);
  const prompt = `
You are a book assistant. From the given text, extract the book title and author.
If nothing is clear, return empty strings.

Text: """${text}"""
Return as JSON like:
{ "title": "...", "author": "..." }
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    const raw = response.choices[0].message.content || "";

    // Strip markdown code block if present
    const jsonString = raw
      .trim()
      .replace(/^```json\s*/, "")  // Remove starting ```json
      .replace(/```$/, "");         // Remove ending ```

    try {
      const json = JSON.parse(jsonString);
      return {
        title: json.title || "",
        author: json.author || "",
      };
    } catch (parseError) {
      console.error("[OpenAIService] Failed to parse response JSON:", parseError);
      throw new BookSearchError("OpenAI returned invalid JSON response");
    }
  } catch (apiError) {
    console.error("[OpenAIService] OpenAI API error:", apiError);
    throw new BookSearchError("Failed to extract book data from OpenAI");
  }
};

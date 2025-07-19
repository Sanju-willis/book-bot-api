// src\services\chattService.ts
import { detectIntent } from "../utils/intenttChain";
import { extractTextFromImage } from "../utils/ocrService"; // implement if not done yet
import { chatBotChain } from "../utils/chatBotChain";
import { handleBookInquiry } from "../handlers/intent/handleBookInquiry";
import { handleOrderStatus } from "../handlers/intent/handleOrderStatus";
import { handleComplaint } from "../handlers/intent/handleComplaint";

export const processUserMessage = async (
  message: string,
  sessionId: string,
  uploadedFile?: Express.Multer.File
) => {
  const hasImage = uploadedFile && uploadedFile.mimetype?.startsWith("image/");
  let imageText = "";

  if (hasImage) {
    imageText = await extractTextFromImage(uploadedFile.buffer);
    console.log("🖼️ ", imageText);
  }

  const intentResult = await detectIntent({ message, imageText });
  const { intent } = intentResult;
 // console.log(`🧠 Intent: ${intent}`);

  switch (intent) {
    case "book_inquiry": {
      const result = await handleBookInquiry(imageText, message);
      return {
        ...result,
        sessionId,
      };
    }

    case "order_status": {
      const result = await handleOrderStatus(message);
      return {
        ...result,
        sessionId,
      };
    }

    case "complaint": {
      const result = await handleComplaint(message);
      return {
        ...result,
        sessionId,
      };
    }

    case "greeting":
      return {
        response: "👋 Hey there! How can I help you?",
        result: null,
        sessionId,
      };

    default: {
  const aiResult = await chatBotChain.invoke(
    { input: message },
    { configurable: { sessionId } }
  );

  const response =
    typeof aiResult === "string"
      ? aiResult
      : "content" in aiResult
      ? aiResult.content
      : "🤖 Sorry, I didn’t get that.";

  return {
    response,
    result: null,
    sessionId,
  };
}

  }
};

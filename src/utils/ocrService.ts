// src\utils\ocrService.ts
import vision from "@google-cloud/vision";
import { OCRServiceError } from "../errors/Errors";

const client = new vision.ImageAnnotatorClient();

export const extractTextFromImage = async (buffer: Buffer): Promise<string> => {
  try {
    const base64Image = buffer.toString("base64");

    const [result] = await client.textDetection({
      image: { content: base64Image },
    });

    const detections = result.textAnnotations;

    if (!detections || detections.length === 0) {
      return "";
    }
    return detections[0].description || "";
  } catch (err) {
    console.error("[OCRService] Error calling Vision API:", err);
    throw new OCRServiceError("Failed to extract text from image");
  }
};

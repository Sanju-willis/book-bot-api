// src\utils\visionService.ts
import axios from "axios";
import { WHATSAPP_ACCESS_TOKEN } from "../config/env";
import { visionClient } from "../config/visionClient";
import {
  MediaURLFetchError,
  MediaDownloadError,
  OCRServiceError,
} from "../errors/Errors";

export const extractImageText = async (mediaId: string): Promise<string> => {
  try {
    const mediaRes = await axios.get(
      `https://graph.facebook.com/v19.0/${mediaId}`,
      {
        headers: { Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}` },
      }
    );

    const mediaUrl = mediaRes.data?.url;
    if (!mediaUrl)
      throw new MediaURLFetchError("Media URL is missing from response");

    const imageRes = await axios.get(mediaUrl, {
      headers: { Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}` },
      responseType: "arraybuffer",
    });

    const imageBuffer = imageRes.data;
    if (!imageBuffer)
      throw new MediaDownloadError("Empty image buffer downloaded");

    const [result] = await visionClient.textDetection({
      image: { content: imageBuffer },
    });

    const detections = result.textAnnotations;
    const fullText = detections?.[0]?.description;

    if (!fullText) throw new OCRServiceError("No text detected in image");

    return fullText.trim();
    console.log('...');
  } catch (err: any) {
    console.error(
      "❌ extractImageText error:",
      err.response?.data || err.message
    );
    throw err; // Let global error handler format this
  }
};

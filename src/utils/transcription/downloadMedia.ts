// src/utils/transcription/downloadMedia.ts
import axios from "axios";
import { WHATSAPP_ACCESS_TOKEN } from "../../config/env";

export const downloadMediaFile = async (mediaId: string): Promise<Buffer> => {
  // 1. Get the media URL
  const mediaUrlRes = await axios.get(
    `https://graph.facebook.com/v19.0/${mediaId}`,
    {
      headers: {
        Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
      },
    }
  );

  const mediaUrl = mediaUrlRes.data?.url;
  if (!mediaUrl) throw new Error("Media URL not found");

  // 2. Download the media file
  const fileRes = await axios.get(mediaUrl, {
    responseType: "arraybuffer",
    headers: {
      Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
    },
  });

  return Buffer.from(fileRes.data);
};

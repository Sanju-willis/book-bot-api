// src/utils/transcription/extractAudioText.ts
import axios from "axios";
import { downloadMediaFile } from "./downloadMedia";
import { DEEPGRAM_API_KEY } from "../../config/env";

export const extractAudioText = async (mediaId: string): Promise<string> => {
  const buffer = await downloadMediaFile(mediaId); // your existing logic
  const response = await axios.post(
    "https://api.deepgram.com/v1/listen",
    buffer,
    {
      headers: {
        "Content-Type": "audio/mpeg", // or correct mime type
        Authorization: `Token ${DEEPGRAM_API_KEY}`,
      },
    }
  );

  return response.data?.results?.channels?.[0]?.alternatives?.[0]?.transcript || "";
};

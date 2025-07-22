// src/utils/transcription/extractAudioTextFromBuffer.ts
import axios from "axios";
import { DEEPGRAM_API_KEY } from "../../config/env";

export const extractAudioTextFromBuffer = async (buffer: Buffer): Promise<string> => {
  const response = await axios.post(
    "https://api.deepgram.com/v1/listen",
    buffer,
    {
      headers: {
        "Content-Type": "audio/mp3", // or audio/wav if needed
        Authorization: `Token ${DEEPGRAM_API_KEY}`,
      },
    }
  );

  return response.data?.results?.channels?.[0]?.alternatives?.[0]?.transcript || "";
};

// src/utils/transcription/extractVideoText.ts
import { downloadMediaFile } from "./downloadMedia";
import { extractAudioFromVideo } from "./extractAudioFromVideo";
import { extractAudioTextFromBuffer } from "./extractAudioTextFromBuffer";

export const extractVideoText = async (mediaId: string): Promise<string> => {
  const videoBuffer = await downloadMediaFile(mediaId);
  const audioBuffer = await extractAudioFromVideo(videoBuffer); // extract .mp3 or .wav
  return await extractAudioTextFromBuffer(audioBuffer);
};

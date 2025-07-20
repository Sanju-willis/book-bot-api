// src\utils\normalizeMessage.ts
type RawPlatformInput = {
  platform: "web" | "whatsapp" | "messenger" | "instagram";
  message?: string;
  imageText?: string;
  imageBuffer?: Buffer;
};

export const normalizeInput = async ({
  platform,
  message = "",
  imageText = "",
  imageBuffer,
}: RawPlatformInput): Promise<{
  userText: string;
  imageText: string;
}> => {
  // If imageBuffer provided but no extracted text
  if (imageBuffer && !imageText) {
    const { extractTextFromImage } = await import("./ocrService");
    imageText = await extractTextFromImage(imageBuffer);
  }

  return {
    userText: message.trim(),
    imageText: imageText.trim(),
  };
};

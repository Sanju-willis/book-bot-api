// src/services/reply/instagramReplyService.ts
import { IG_PAGE_ACCESS_TOKEN, IG_BUSINESS_ID } from "../../config/env";

export const sendInstagramReply = async (
  recipientId: string,
  message: string
) => {
  const url = `https://graph.facebook.com/v19.0/${IG_BUSINESS_ID}/messages?access_token=${IG_PAGE_ACCESS_TOKEN}`;

  const payload = {
    messaging_type: "RESPONSE",
    recipient: { id: recipientId },
    message: { text: message },
  };

  console.log(
    "📦 Sending IG reply with payload:",
    JSON.stringify(payload, null, 2)
  );

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("❌ IG reply failed:", result.error || result);
      throw new Error(result.error?.message || "Instagram reply failed");
    }

    console.log("📤 IG reply sent:", result);
  } catch (err) {
    console.error("❌ IG reply error:", err);
    throw err;
  }
};

import { IG_PAGE_ACCESS_TOKEN } from "../config/env";

export const sendInstagramReply = async (recipientId: string, message: string) => {
  // TEMP: Hardcoded token for testing
  const accessToken = "IGAAbgB3nYxfZABZAFBoT0ZA2QXJTZATRzT0NQeE4zOTRtcEgwdWRnTHowaDRGZA1Jua1dVQ2pyMTdRemQtc2JNWFBMWWpTZAGVIR0FsMnVGeVI2T2RLN2dyYjN4d181aXdUZA1NTZAlBTenV4UlQtaERac1p1RVJRYmwtZAVBOeGF6UVRxSQZDZD";
const IG_BUSINESS_ID = "17841456829008565"; // the `recipient.id` from webhook
const url = `https://graph.facebook.com/v19.0/${IG_BUSINESS_ID}/messages?access_token=${accessToken}`;

  const payload = {
    messaging_type: "RESPONSE",
    recipient: { id: recipientId },
    message: { text: message },
  };

  console.log("📦 Sending IG reply with payload:", JSON.stringify(payload, null, 2));

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


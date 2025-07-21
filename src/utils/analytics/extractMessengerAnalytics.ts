// src/utils/analytics/extractMessengerAnalytics.ts

export type MessengerAnalytics = {
  ipAddress: string | undefined;
  userAgent: string | undefined;
  apiVersion: string | undefined;
  signature256: string | undefined;
  forwardedHost: string | undefined;
  forwardedProto: string | undefined;
};

export const extractMessengerAnalytics = (headers: Record<string, any>): MessengerAnalytics => {
  const analytics: MessengerAnalytics = {
    ipAddress: headers["x-forwarded-for"],
    userAgent: headers["user-agent"],
    apiVersion: headers["facebook-api-version"],
    signature256: headers["x-hub-signature-256"],
    forwardedHost: headers["x-forwarded-host"],
    forwardedProto: headers["x-forwarded-proto"],
  };

  console.log(`📊 Messenger Webhook Analytics:
  🌐 IP Address:        ${analytics.ipAddress || "N/A"}
  🔍 Geo (lookup IP):   ${analytics.ipAddress ? `https://ipinfo.io/${analytics.ipAddress}` : "N/A"}
  🧾 User Agent:        ${analytics.userAgent || "N/A"}
  🔢 API Version:       ${analytics.apiVersion || "N/A"}
  📦 Forwarded Host:    ${analytics.forwardedHost || "N/A"}
  🔐 Signature (SHA256): ${analytics.signature256?.slice(0, 16) || "N/A"}...
  ☁️ Protocol Used:     ${analytics.forwardedProto || "N/A"}
  `);

  return analytics;
};

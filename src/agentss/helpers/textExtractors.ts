export const extractOrderIdFromText = (text: string): string | null => {
  const match = text.match(/\b[A-Z0-9]{5,}\b/i);
  return match ? match[0] : null;
};

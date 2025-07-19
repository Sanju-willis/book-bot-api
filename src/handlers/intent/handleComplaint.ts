// src\handlers\intent\handleComplaint.ts
export const handleComplaint = async (text: string) => {
  return {
    response: `😞 I'm sorry to hear that. Could you describe the issue and provide your Order ID?`,
    result: null,
  };
};

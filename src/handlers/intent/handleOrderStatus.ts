// src\handlers\intent\handleOrderStatus.ts
export const handleOrderStatus = async (text: string) => {
  return {
    response: `📦 Please share your Order ID so I can check the status.`,
    result: null,
  };
};

// src\utils\responses\services\orderService.ts
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema/orders";

export const findOrderById = async (orderId: string) => {
  try {
    console.log(`🗃️ Querying DB for orderId: ${orderId}`);
    const result = await db
      .select()
      .from(orders)
      .where(eq(orders.orderId, orderId))
      .limit(1);

    console.log("🗂️ DB Query Result:", result);
    return result[0] || null;
  } catch (err) {
    console.error("❌ [findOrderById] DB query failed:", err);
    return null;
  }
};

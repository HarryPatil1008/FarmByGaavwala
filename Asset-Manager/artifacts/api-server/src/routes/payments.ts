import { Router } from "express";
import crypto from "crypto";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db, ordersTable } from "@workspace/db";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

router.post("/payments/razorpay/create-order", authenticate, async (req, res): Promise<void> => {
  const parsed = z.object({ orderId: z.number().int().positive() }).safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    res.status(400).json({ error: "Razorpay not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET." });
    return;
  }

  const [order] = await db.select().from(ordersTable).where(and(eq(ordersTable.id, parsed.data.orderId), eq(ordersTable.userId, req.user!.userId))).limit(1);
  if (!order) { res.status(404).json({ error: "Order not found" }); return; }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Basic ${auth}` },
    body: JSON.stringify({ amount: order.total * 100, currency: "INR", receipt: `order_${order.id}` }),
  });

  if (!rzpRes.ok) { res.status(500).json({ error: "Failed to create Razorpay order" }); return; }

  const rzpOrder = await rzpRes.json() as { id: string; amount: number; currency: string };
  await db.update(ordersTable).set({ razorpayOrderId: rzpOrder.id }).where(eq(ordersTable.id, order.id));

  res.json({ razorpayOrderId: rzpOrder.id, amount: rzpOrder.amount, currency: rzpOrder.currency, keyId });
});

router.post("/payments/razorpay/verify", authenticate, async (req, res): Promise<void> => {
  const parsed = z.object({
    razorpayOrderId: z.string(),
    razorpayPaymentId: z.string(),
    razorpaySignature: z.string(),
    orderId: z.number().int().positive(),
  }).safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) { res.status(400).json({ error: "Razorpay not configured" }); return; }

  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = parsed.data;
  const expected = crypto.createHmac("sha256", keySecret).update(`${razorpayOrderId}|${razorpayPaymentId}`).digest("hex");

  if (expected !== razorpaySignature) {
    res.status(400).json({ success: false, message: "Payment verification failed" });
    return;
  }

  await db.update(ordersTable).set({ paymentStatus: "paid", status: "confirmed", razorpayPaymentId }).where(eq(ordersTable.id, orderId));
  res.json({ success: true, message: "Payment verified successfully" });
});

export default router;

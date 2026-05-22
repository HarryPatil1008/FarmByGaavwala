import { Router } from "express";
import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { db, cartTable, cartItemsTable, ordersTable, orderItemsTable, productsTable } from "@workspace/db";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

const shippingSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().nullable().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().min(1),
});

const orderInputSchema = z.object({
  shippingAddress: shippingSchema,
  paymentMethod: z.string(),
  notes: z.string().optional(),
});

export async function buildOrderResponse(order: typeof ordersTable.$inferSelect) {
  const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, order.id));
  return {
    id: order.id,
    userId: order.userId,
    status: order.status,
    subtotal: order.subtotal,
    total: order.total,
    shippingAddress: order.shippingAddress as { name: string; phone: string; line1: string; line2?: string | null; city: string; state: string; pincode: string },
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    razorpayOrderId: order.razorpayOrderId ?? null,
    razorpayPaymentId: order.razorpayPaymentId ?? null,
    notes: order.notes ?? null,
    items: items.map((i) => ({
      id: i.id,
      orderId: i.orderId,
      productId: i.productId,
      quantity: i.quantity,
      price: i.price,
      name: i.name,
      emoji: i.emoji ?? null,
    })),
    createdAt: order.createdAt.toISOString(),
  };
}

router.get("/orders", authenticate, async (req, res): Promise<void> => {
  const orders = await db.select().from(ordersTable).where(eq(ordersTable.userId, req.user!.userId));
  res.json(await Promise.all(orders.map(buildOrderResponse)));
});

router.post("/orders", authenticate, async (req, res): Promise<void> => {
  const parsed = orderInputSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }

  const [cart] = await db.select().from(cartTable).where(eq(cartTable.userId, req.user!.userId)).limit(1);
  if (!cart) { res.status(400).json({ error: "Cart is empty" }); return; }

  const cartItems = await db.select().from(cartItemsTable).where(eq(cartItemsTable.cartId, cart.id));
  if (cartItems.length === 0) { res.status(400).json({ error: "Cart is empty" }); return; }

  const productIds = cartItems.map((i) => i.productId);
  const products = await db.select().from(productsTable).where(inArray(productsTable.id, productIds));
  const productMap = new Map(products.map((p) => [p.id, p]));

  let subtotal = 0;
  const lineItems = cartItems.map((item) => {
    const p = productMap.get(item.productId)!;
    subtotal += p.price * item.quantity;
    return { productId: item.productId, quantity: item.quantity, price: p.price, name: p.name, emoji: p.emoji ?? undefined };
  });

  const { shippingAddress, paymentMethod, notes } = parsed.data;
  const [order] = await db.insert(ordersTable).values({
    userId: req.user!.userId,
    subtotal,
    total: subtotal,
    shippingAddress,
    paymentMethod,
    paymentStatus: "pending",
    notes,
  }).returning();

  await db.insert(orderItemsTable).values(lineItems.map((item) => ({ orderId: order.id, ...item })));
  await db.delete(cartItemsTable).where(eq(cartItemsTable.cartId, cart.id));

  res.status(201).json(await buildOrderResponse(order));
});

router.get("/orders/:id", authenticate, async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) { res.status(404).json({ error: "Not found" }); return; }
  const [order] = await db.select().from(ordersTable).where(and(eq(ordersTable.id, id), eq(ordersTable.userId, req.user!.userId))).limit(1);
  if (!order) { res.status(404).json({ error: "Order not found" }); return; }
  res.json(await buildOrderResponse(order));
});

router.post("/orders/:id/cancel", authenticate, async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) { res.status(404).json({ error: "Not found" }); return; }
  const [order] = await db.select().from(ordersTable).where(and(eq(ordersTable.id, id), eq(ordersTable.userId, req.user!.userId))).limit(1);
  if (!order) { res.status(404).json({ error: "Order not found" }); return; }
  if (!["pending", "confirmed"].includes(order.status)) { res.status(400).json({ error: "Cannot cancel this order" }); return; }
  const [updated] = await db.update(ordersTable).set({ status: "cancelled" }).where(eq(ordersTable.id, id)).returning();
  res.json(await buildOrderResponse(updated));
});

export default router;

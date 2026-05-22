import { Router } from "express";
import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { db, cartTable, cartItemsTable, productsTable } from "@workspace/db";
import { authenticate } from "../middlewares/authenticate.js";
import { formatProduct } from "./products.js";

const router = Router();

async function getOrCreateCart(userId: number) {
  const [existing] = await db.select().from(cartTable).where(eq(cartTable.userId, userId)).limit(1);
  if (existing) return existing;
  const [cart] = await db.insert(cartTable).values({ userId }).returning();
  return cart;
}

async function buildCartResponse(cart: typeof cartTable.$inferSelect) {
  const items = await db.select().from(cartItemsTable).where(eq(cartItemsTable.cartId, cart.id));
  const productIds = items.map((i) => i.productId);
  const products =
    productIds.length > 0
      ? await db.select().from(productsTable).where(inArray(productsTable.id, productIds))
      : [];
  const productMap = new Map(products.map((p) => [p.id, p]));

  let total = 0;
  const enriched = items.map((item) => {
    const p = productMap.get(item.productId);
    if (p) total += p.price * item.quantity;
    return { id: item.id, cartId: item.cartId, productId: item.productId, quantity: item.quantity, product: p ? formatProduct(p) : null };
  });

  return { id: cart.id, userId: cart.userId, items: enriched, total };
}

export { getOrCreateCart, buildCartResponse };

router.get("/cart", authenticate, async (req, res): Promise<void> => {
  const cart = await getOrCreateCart(req.user!.userId);
  res.json(await buildCartResponse(cart));
});

const addItemSchema = z.object({ productId: z.number().int().positive(), quantity: z.number().int().min(1) });

router.post("/cart/items", authenticate, async (req, res): Promise<void> => {
  const parsed = addItemSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const { productId, quantity } = parsed.data;
  const cart = await getOrCreateCart(req.user!.userId);

  const [existing] = await db
    .select()
    .from(cartItemsTable)
    .where(and(eq(cartItemsTable.cartId, cart.id), eq(cartItemsTable.productId, productId)))
    .limit(1);

  if (existing) {
    await db.update(cartItemsTable).set({ quantity: existing.quantity + quantity }).where(eq(cartItemsTable.id, existing.id));
  } else {
    await db.insert(cartItemsTable).values({ cartId: cart.id, productId, quantity });
  }
  res.json(await buildCartResponse(cart));
});

router.put("/cart/items/:id", authenticate, async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id));
  const parsed = z.object({ quantity: z.number().int().min(1) }).safeParse(req.body);
  if (isNaN(id) || !parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }

  const cart = await getOrCreateCart(req.user!.userId);
  const [item] = await db.select().from(cartItemsTable).where(and(eq(cartItemsTable.id, id), eq(cartItemsTable.cartId, cart.id))).limit(1);
  if (!item) { res.status(404).json({ error: "Cart item not found" }); return; }

  await db.update(cartItemsTable).set({ quantity: parsed.data.quantity }).where(eq(cartItemsTable.id, id));
  res.json(await buildCartResponse(cart));
});

router.delete("/cart/items/:id", authenticate, async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) { res.status(400).json({ error: "Invalid input" }); return; }

  const cart = await getOrCreateCart(req.user!.userId);
  await db.delete(cartItemsTable).where(and(eq(cartItemsTable.id, id), eq(cartItemsTable.cartId, cart.id)));
  res.json(await buildCartResponse(cart));
});

router.delete("/cart", authenticate, async (req, res): Promise<void> => {
  const cart = await getOrCreateCart(req.user!.userId);
  await db.delete(cartItemsTable).where(eq(cartItemsTable.cartId, cart.id));
  res.status(204).send();
});

export default router;

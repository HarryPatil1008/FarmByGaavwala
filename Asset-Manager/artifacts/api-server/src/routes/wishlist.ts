import { Router } from "express";
import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { db, wishlistTable, productsTable } from "@workspace/db";
import { authenticate } from "../middlewares/authenticate.js";
import { formatProduct } from "./products.js";

const router = Router();

router.get("/wishlist", authenticate, async (req, res): Promise<void> => {
  const entries = await db.select().from(wishlistTable).where(eq(wishlistTable.userId, req.user!.userId));
  const ids = entries.map((e) => e.productId);
  const products = ids.length > 0 ? await db.select().from(productsTable).where(inArray(productsTable.id, ids)) : [];
  const productMap = new Map(products.map((p) => [p.id, p]));

  res.json(
    entries.map((e) => ({
      id: e.id,
      userId: e.userId,
      productId: e.productId,
      product: productMap.has(e.productId) ? formatProduct(productMap.get(e.productId)!) : null,
      createdAt: e.createdAt.toISOString(),
    }))
  );
});

router.post("/wishlist", authenticate, async (req, res): Promise<void> => {
  const parsed = z.object({ productId: z.number().int().positive() }).safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }

  const { productId } = parsed.data;
  const [existing] = await db
    .select()
    .from(wishlistTable)
    .where(and(eq(wishlistTable.userId, req.user!.userId), eq(wishlistTable.productId, productId)))
    .limit(1);

  const entry = existing ?? (await db.insert(wishlistTable).values({ userId: req.user!.userId, productId }).returning())[0];
  const [product] = await db.select().from(productsTable).where(eq(productsTable.id, productId)).limit(1);

  res.status(201).json({
    id: entry.id,
    userId: entry.userId,
    productId: entry.productId,
    product: product ? formatProduct(product) : null,
    createdAt: entry.createdAt.toISOString(),
  });
});

router.delete("/wishlist/:productId", authenticate, async (req, res): Promise<void> => {
  const productId = parseInt(String(req.params.productId));
  if (isNaN(productId)) { res.status(400).json({ error: "Invalid input" }); return; }
  await db.delete(wishlistTable).where(and(eq(wishlistTable.userId, req.user!.userId), eq(wishlistTable.productId, productId)));
  res.status(204).send();
});

export default router;

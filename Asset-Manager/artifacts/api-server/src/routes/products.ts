import { Router } from "express";
import { and, eq, ilike, sql } from "drizzle-orm";
import { db, productsTable } from "@workspace/db";

const router = Router();

function formatProduct(p: typeof productsTable.$inferSelect) {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description ?? null,
    price: p.price,
    originalPrice: p.originalPrice ?? null,
    discount: p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : null,
    stock: p.stock,
    categoryId: p.categoryId ?? null,
    rating: p.rating / 10,
    reviewCount: p.reviewCount,
    images: p.images ?? [],
    badge: p.badge ?? null,
    emoji: p.emoji ?? null,
    featured: p.featured,
    active: p.active,
    createdAt: p.createdAt.toISOString(),
  };
}

export { formatProduct };

router.get("/products", async (req, res): Promise<void> => {
  const page = Math.max(1, parseInt(String(req.query.page ?? "1")));
  const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit ?? "20"))));
  const offset = (page - 1) * limit;

  const conditions = [eq(productsTable.active, true)];
  if (req.query.search) conditions.push(ilike(productsTable.name, `%${req.query.search}%`));
  if (req.query.featured === "true") conditions.push(eq(productsTable.featured, true));

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(productsTable)
    .where(and(...conditions));

  const products = await db
    .select()
    .from(productsTable)
    .where(and(...conditions))
    .limit(limit)
    .offset(offset);

  res.json({ products: products.map(formatProduct), total: count ?? 0, page, limit });
});

router.get("/products/:id", async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) { res.status(404).json({ error: "Not found" }); return; }
  const [product] = await db.select().from(productsTable).where(eq(productsTable.id, id)).limit(1);
  if (!product) { res.status(404).json({ error: "Product not found" }); return; }
  res.json(formatProduct(product));
});

export default router;

import { Router } from "express";
import { eq, sql, lt, desc } from "drizzle-orm";
import { z } from "zod";
import { db, productsTable, ordersTable, usersTable, categoriesTable, orderItemsTable } from "@workspace/db";
import { authenticate, requireAdmin } from "../middlewares/authenticate.js";
import { formatProduct } from "./products.js";
import { buildOrderResponse } from "./orders.js";
import multer from "multer";
import type { Request } from "express";

const router = Router();

function formatUser(u: typeof usersTable.$inferSelect & { orderCount?: number; totalSpent?: number }) {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    phone: u.phone ?? null,
    role: u.role,
    blocked: u.blocked,
    orderCount: u.orderCount ?? 0,
    totalSpent: u.totalSpent ?? 0,
    createdAt: u.createdAt.toISOString(),
  };
}

function formatCategory(c: typeof categoriesTable.$inferSelect & { productCount?: number }) {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description ?? null,
    emoji: c.emoji ?? null,
    productCount: c.productCount ?? 0,
    createdAt: c.createdAt.toISOString(),
  };
}

router.get("/admin/dashboard", authenticate, requireAdmin, async (_req, res): Promise<void> => {
  const [{ count: totalOrders }] = await db.select({ count: sql<number>`count(*)::int` }).from(ordersTable);
  const [{ count: totalUsers }] = await db.select({ count: sql<number>`count(*)::int` }).from(usersTable);
  const [{ count: totalProducts }] = await db.select({ count: sql<number>`count(*)::int` }).from(productsTable);
  const [{ sum }] = await db.select({ sum: sql<number>`coalesce(sum(total),0)::int` }).from(ordersTable).where(eq(ordersTable.paymentStatus, "paid"));
  const [{ count: pendingOrders }] = await db.select({ count: sql<number>`count(*)::int` }).from(ordersTable).where(eq(ordersTable.status, "pending"));
  const [{ count: lowStockCount }] = await db.select({ count: sql<number>`count(*)::int` }).from(productsTable).where(lt(productsTable.stock, 10));
  const recent = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt)).limit(5);
  res.json({
    totalOrders: totalOrders ?? 0,
    totalRevenue: sum ?? 0,
    totalUsers: totalUsers ?? 0,
    totalProducts: totalProducts ?? 0,
    pendingOrders: pendingOrders ?? 0,
    lowStockCount: lowStockCount ?? 0,
    recentOrders: await Promise.all(recent.map(buildOrderResponse)),
  });
});

router.get("/admin/products", authenticate, requireAdmin, async (_req, res): Promise<void> => {
  res.json((await db.select().from(productsTable).orderBy(desc(productsTable.createdAt))).map(formatProduct));
});

const productInputSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  price: z.number().int().min(0),
  originalPrice: z.number().int().optional(),
  stock: z.number().int().min(0),
  categoryId: z.number().int().optional(),
  images: z.array(z.string()).optional(),
  badge: z.string().optional(),
  emoji: z.string().optional(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
});

// router.post("/admin/products", authenticate, requireAdmin, async (req, res): Promise<void> => {
//   const parsed = productInputSchema.safeParse(req.body);
//   if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }
//   const [product] = await db.insert(productsTable).values(parsed.data).returning();
//   res.status(201).json(formatProduct(product));
// });

router.post(
  "/admin/products",
  authenticate,
  requireAdmin,
  async (req, res): Promise<void> => {
    try {
      const parsed = productInputSchema.safeParse(req.body);

      if (!parsed.success) {
        res.status(400).json({ error: "Invalid data", details: parsed.error });
        return;
      }

      // ✅ 1. SAFE SLUG (no duplicate issue)
      const slugBase = parsed.data.name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      const slug = `${slugBase}-${Date.now()}`;

      // ✅ 2. FIX IMAGES FORMAT
      const images = (req.files as Express.Multer.File[]).map(
  (file) => `/uploads/${file.filename}`
);

      // ✅ 3. FINAL INSERT
      const [product] = await db
        .insert(productsTable)
        .values({
          ...parsed.data,
          slug,
          images,
          active: parsed.data.active ?? true,
          featured: parsed.data.featured ?? false,
        })
        .returning();

      res.json(product);
    } catch (err: any) {
      console.error("PRODUCT INSERT ERROR:", err);
      res.status(500).json({
        error: "Failed to create product",
        message: err.message,
      });
    }
  }
);

router.put("/admin/products/:id", authenticate, requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) { res.status(404).json({ error: "Not found" }); return; }
  const [existing] = await db.select({ id: productsTable.id }).from(productsTable).where(eq(productsTable.id, id)).limit(1);
  if (!existing) { res.status(404).json({ error: "Product not found" }); return; }
  const parsed = productInputSchema.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const [updated] = await db.update(productsTable).set(parsed.data).where(eq(productsTable.id, id)).returning();
  res.json(formatProduct(updated));
});

router.delete("/admin/products/:id", authenticate, requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) { res.status(404).json({ error: "Not found" }); return; }
  await db.delete(productsTable).where(eq(productsTable.id, id));
  res.status(204).send();
});

router.get("/admin/orders", authenticate, requireAdmin, async (_req, res): Promise<void> => {
  const orders = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt));
  res.json(await Promise.all(orders.map(buildOrderResponse)));
});

router.put("/admin/orders/:id", authenticate, requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) { res.status(404).json({ error: "Not found" }); return; }
  const parsed = z.object({ status: z.string().optional(), paymentStatus: z.string().optional() }).safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const [existing] = await db.select({ id: ordersTable.id }).from(ordersTable).where(eq(ordersTable.id, id)).limit(1);
  if (!existing) { res.status(404).json({ error: "Order not found" }); return; }
  const [updated] = await db.update(ordersTable).set(parsed.data).where(eq(ordersTable.id, id)).returning();
  res.json(await buildOrderResponse(updated));
});

router.get("/admin/users", authenticate, requireAdmin, async (_req, res): Promise<void> => {
  const users = await db.select().from(usersTable).orderBy(desc(usersTable.createdAt));
  const orderStats = await db
    .select({
      userId: ordersTable.userId,
      orderCount: sql<number>`count(*)::int`,
      totalSpent: sql<number>`coalesce(sum(total),0)::int`,
    })
    .from(ordersTable)
    .groupBy(ordersTable.userId);

  const statsMap = new Map(orderStats.map((s) => [s.userId, s]));
  res.json(users.map((u) => formatUser({ ...u, orderCount: statsMap.get(u.id)?.orderCount ?? 0, totalSpent: statsMap.get(u.id)?.totalSpent ?? 0 })));
});

router.patch("/admin/users/:id/block", authenticate, requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) { res.status(404).json({ error: "Not found" }); return; }
  const parsed = z.object({ blocked: z.boolean() }).safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const [updated] = await db.update(usersTable).set({ blocked: parsed.data.blocked }).where(eq(usersTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "User not found" }); return; }
  res.json(formatUser(updated));
});

router.get("/admin/categories", authenticate, requireAdmin, async (_req, res): Promise<void> => {
  const cats = await db.select().from(categoriesTable).orderBy(categoriesTable.name);
  const counts = await db
    .select({ categoryId: productsTable.categoryId, count: sql<number>`count(*)::int` })
    .from(productsTable)
    .groupBy(productsTable.categoryId);
  const countMap = new Map(counts.map((c) => [c.categoryId, c.count]));
  res.json(cats.map((c) => formatCategory({ ...c, productCount: countMap.get(c.id) ?? 0 })));
});

const categorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  emoji: z.string().optional(),
});

router.post("/admin/categories", authenticate, requireAdmin, async (req, res): Promise<void> => {
  const parsed = categorySchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const [cat] = await db.insert(categoriesTable).values(parsed.data).returning();
  res.status(201).json(formatCategory(cat));
});

router.put("/admin/categories/:id", authenticate, requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) { res.status(404).json({ error: "Not found" }); return; }
  const parsed = categorySchema.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const [updated] = await db.update(categoriesTable).set(parsed.data).where(eq(categoriesTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "Category not found" }); return; }
  res.json(formatCategory(updated));
});

router.delete("/admin/categories/:id", authenticate, requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) { res.status(404).json({ error: "Not found" }); return; }
  await db.delete(categoriesTable).where(eq(categoriesTable.id, id));
  res.status(204).send();
});

router.get("/admin/stats/monthly", authenticate, requireAdmin, async (_req, res): Promise<void> => {
  const rows = await db.execute(sql`
    SELECT
      TO_CHAR(DATE_TRUNC('month', created_at), 'Mon YY') AS month,
      COALESCE(SUM(total), 0)::int AS revenue,
      COUNT(*)::int AS orders
    FROM orders
    WHERE created_at >= NOW() - INTERVAL '6 months'
    GROUP BY DATE_TRUNC('month', created_at)
    ORDER BY DATE_TRUNC('month', created_at)
  `);
  res.json(rows.rows);
});

router.get("/admin/inventory", authenticate, requireAdmin, async (_req, res): Promise<void> => {
  const products = await db.select().from(productsTable).orderBy(productsTable.stock);
  res.json(products.map(formatProduct));
});

export default router;

import { Router } from "express";
import { db, categoriesTable } from "@workspace/db";

const router = Router();

router.get("/categories", async (_req, res): Promise<void> => {
  const cats = await db.select().from(categoriesTable);
  res.json(
    cats.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description ?? null,
      emoji: c.emoji ?? null,
    }))
  );
});

export default router;

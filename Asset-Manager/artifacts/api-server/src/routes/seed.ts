import { Router } from "express";
import { db, categoriesTable, productsTable } from "@workspace/db";

const router = Router();

router.post("/seed", async (_req, res): Promise<void> => {
  await db.insert(categoriesTable).values([
    { name: "Dairy", slug: "dairy", description: "Fresh dairy products", emoji: "🥛" },
    { name: "Vegetables", slug: "vegetables", description: "Farm fresh vegetables", emoji: "🥦" },
    { name: "Fruits", slug: "fruits", description: "Seasonal fruits", emoji: "🍎" },
    { name: "Grains & Pulses", slug: "grains", description: "Organic grains & pulses", emoji: "🌾" },
    { name: "Combos", slug: "combos", description: "Value combo packs", emoji: "🎁" },
  ]).onConflictDoNothing();

  await db.insert(productsTable).values([
    { name: "A2 Desi Cow Ghee", slug: "a2-desi-cow-ghee", description: "Pure hand-churned A2 ghee from Gir cows. Rich in nutrients and traditional flavour.", price: 899, originalPrice: 1200, stock: 50, categoryId: 1, rating: 48, reviewCount: 245, images: [], badge: "Bestseller", emoji: "🫙", featured: true },
    { name: "Fresh Paneer", slug: "fresh-paneer", description: "Soft, creamy paneer made from pure A2 milk.", price: 180, originalPrice: 220, stock: 100, categoryId: 1, rating: 46, reviewCount: 187, images: [], badge: "Fresh Daily", emoji: "🧀", featured: true },
    { name: "A2 Full Cream Milk", slug: "a2-full-cream-milk", description: "Fresh farm-to-table A2 milk. Natural and unadulterated.", price: 70, originalPrice: 80, stock: 200, categoryId: 1, rating: 47, reviewCount: 312, images: [], emoji: "🥛", featured: true },
    { name: "Organic Cow Butter", slug: "organic-cow-butter", description: "Creamy, naturally yellow butter from grass-fed desi cows.", price: 299, originalPrice: 380, stock: 75, categoryId: 1, rating: 45, reviewCount: 98, images: [], emoji: "🧈", featured: false },
    { name: "Farm Fresh Spinach", slug: "farm-fresh-spinach", description: "Pesticide-free spinach harvested fresh every morning.", price: 45, originalPrice: 60, stock: 150, categoryId: 2, rating: 44, reviewCount: 76, images: [], badge: "Organic", emoji: "🥬", featured: false },
    { name: "Country Tomatoes", slug: "country-tomatoes", description: "Naturally ripened, rich red tomatoes from our farm.", price: 55, originalPrice: 70, stock: 200, categoryId: 2, rating: 43, reviewCount: 89, images: [], emoji: "🍅", featured: false },
    { name: "Organic Moong Dal", slug: "organic-moong-dal", description: "Sun-dried organic moong dal. High in protein and easy to digest.", price: 149, originalPrice: 180, stock: 120, categoryId: 4, rating: 46, reviewCount: 134, images: [], badge: "Organic", emoji: "🫘", featured: true },
    { name: "Desi Wheat Flour (Atta)", slug: "desi-wheat-atta", description: "Stone-ground whole wheat flour from heritage wheat varieties.", price: 89, originalPrice: 110, stock: 300, categoryId: 4, rating: 47, reviewCount: 201, images: [], emoji: "🌾", featured: true },
    { name: "Dairy Combo Pack", slug: "dairy-combo-pack", description: "Ghee 500ml + Paneer 250g + Butter 200g. Best value for your kitchen.", price: 1099, originalPrice: 1499, stock: 30, categoryId: 5, rating: 48, reviewCount: 56, images: [], badge: "Combo", emoji: "🎁", featured: true },
    { name: "Weekly Veggie Box", slug: "weekly-veggie-box", description: "6 seasonal vegetables, freshly harvested. Enough for a family of 4.", price: 249, originalPrice: 320, stock: 40, categoryId: 5, rating: 45, reviewCount: 43, images: [], badge: "Popular", emoji: "🥗", featured: true },
  ]).onConflictDoNothing();

  res.json({ message: "Database seeded successfully" });
});

export default router;

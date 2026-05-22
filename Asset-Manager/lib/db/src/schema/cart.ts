import { pgTable, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const cartTable = pgTable("cart", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const cartItemsTable = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  cartId: integer("cart_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertCartSchema = createInsertSchema(cartTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertCartItemSchema = createInsertSchema(cartItemsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertCart = z.infer<typeof insertCartSchema>;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type Cart = typeof cartTable.$inferSelect;
export type CartItem = typeof cartItemsTable.$inferSelect;

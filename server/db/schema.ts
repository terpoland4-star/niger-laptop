import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  nameFr: text("name_fr").notNull(),
  nameEn: text("name_en").notNull(),
  category: text("category").notNull(),
  condition: text("condition").notNull(),
  price: integer("price"),
  oldPrice: integer("old_price"),
  thumbnail: text("thumbnail"),
  featured: integer("featured", { mode: "boolean" }).default(false),
  rating: real("rating"),
  descriptionFr: text("description_fr"),
  descriptionEn: text("description_en"),
  stockQuantity: integer("stock_quantity").default(0),
});

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  orderNumber: text("order_number").notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  deliveryAddress: text("delivery_address"),
  status: text("status").notNull().default("pending"),
  total: integer("total").notNull(),
  itemsJson: text("items_json").notNull(),
  createdAt: text("created_at").notNull(),
});

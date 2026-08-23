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
  specs: text("specs"),
  costPrice: integer("cost_price"),
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
  customerId: text("customer_id"),
  isPaid: integer("is_paid", { mode: "boolean" }).default(false),
  paidAt: text("paid_at"),
  channel: text("channel").notNull().default("site"),
});

export const customers = sqliteTable("customers", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  phone: text("phone"),
  createdAt: text("created_at").notNull(),
});

export const carts = sqliteTable("carts", {
  phone: text("phone").primaryKey(),
  itemsJson: text("items_json").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const admins = sqliteTable("admins", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("editor"),
  createdAt: text("created_at").notNull(),
});

export const productHistory = sqliteTable("product_history", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull(),
  action: text("action").notNull(),
  changesJson: text("changes_json"),
  adminId: text("admin_id").notNull(),
  createdAt: text("created_at").notNull(),
});

export const orderStatusHistory = sqliteTable("order_status_history", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull(),
  status: text("status").notNull(),
  note: text("note"),
  changedBy: text("changed_by"),
  createdAt: text("created_at").notNull(),
});

export const expenses = sqliteTable("expenses", {
  id: text("id").primaryKey(),
  type: text("type").notNull().default("charge"),
  category: text("category").notNull(),
  label: text("label").notNull(),
  amount: integer("amount").notNull(),
  date: text("date").notNull(),
  note: text("note"),
  createdBy: text("created_by"),
  createdAt: text("created_at").notNull(),
});

export const suppliers = sqliteTable("suppliers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone"),
  note: text("note"),
  createdAt: text("created_at").notNull(),
});

export const purchases = sqliteTable("purchases", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull(),
  supplierId: text("supplier_id"),
  quantity: integer("quantity").notNull(),
  unitCost: integer("unit_cost").notNull(),
  totalCost: integer("total_cost").notNull(),
  date: text("date").notNull(),
  note: text("note"),
  createdBy: text("created_by"),
  createdAt: text("created_at").notNull(),
});

export const deliveryAgents = sqliteTable("delivery_agents", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  active: integer("active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").notNull(),
});

export const deliveries = sqliteTable("deliveries", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull(),
  agentId: text("agent_id").notNull(),
  status: text("status").notNull().default("assigned"),
  startedAt: text("started_at"),
  deliveredAt: text("delivered_at"),
  createdAt: text("created_at").notNull(),
});

export const agentLocations = sqliteTable("agent_locations", {
  agentId: text("agent_id").primaryKey(),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  updatedAt: text("updated_at").notNull(),
});

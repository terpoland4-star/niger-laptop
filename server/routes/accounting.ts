import { Router } from "express";
import { db } from "../db/index";
import { expenses, suppliers, purchases, orders, products } from "../db/schema";
import { eq, desc, gte, lte, and } from "drizzle-orm";
import { z } from "zod";
import { randomUUID } from "crypto";
import { requireAdmin, requireEditor, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

// ---------- Validators ----------
const expenseSchema = z.object({
  type: z.enum(["charge", "revenue"]).default("charge"),
  category: z.string().min(1),
  label: z.string().min(1),
  amount: z.number().int().positive(),
  date: z.string().min(1),
  note: z.string().optional(),
});

const supplierSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
  note: z.string().optional(),
});

const purchaseSchema = z.object({
  productId: z.string().min(1),
  supplierId: z.string().optional(),
  quantity: z.number().int().positive(),
  unitCost: z.number().int().positive(),
  date: z.string().min(1),
  note: z.string().optional(),
});

// ---------- Expenses ----------
router.get("/expenses", requireAdmin, async (req: AuthenticatedRequest, res) => {
  const all = await db.select().from(expenses).orderBy(desc(expenses.date));
  res.json({ data: all });
});

router.post("/expenses", requireAdmin, async (req: AuthenticatedRequest, res) => {
  const parsed = expenseSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const id = randomUUID();
  const now = new Date().toISOString();
  await db.insert(expenses).values({
    id,
    ...parsed.data,
    createdBy: req.admin?.id,
    createdAt: now,
  });
  res.status(201).json({ data: { id, ...parsed.data, createdAt: now } });
});

router.put("/expenses/:id", requireAdmin, async (req: AuthenticatedRequest, res) => {
  const parsed = expenseSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  await db.update(expenses).set(parsed.data).where(eq(expenses.id, req.params.id));
  res.json({ ok: true });
});

router.delete("/expenses/:id", requireAdmin, requireEditor, async (req: AuthenticatedRequest, res) => {
  await db.delete(expenses).where(eq(expenses.id, req.params.id));
  res.json({ ok: true });
});

// ---------- Suppliers ----------
router.get("/suppliers", requireAdmin, async (req: AuthenticatedRequest, res) => {
  const all = await db.select().from(suppliers).orderBy(desc(suppliers.createdAt));
  res.json({ data: all });
});

router.post("/suppliers", requireAdmin, async (req: AuthenticatedRequest, res) => {
  const parsed = supplierSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const id = randomUUID();
  const now = new Date().toISOString();
  await db.insert(suppliers).values({ id, ...parsed.data, createdAt: now });
  res.status(201).json({ data: { id, ...parsed.data, createdAt: now } });
});

// ---------- Purchases ----------
router.get("/purchases", requireAdmin, async (req: AuthenticatedRequest, res) => {
  const all = await db.select().from(purchases).orderBy(desc(purchases.date));
  res.json({ data: all });
});

router.post("/purchases", requireAdmin, async (req: AuthenticatedRequest, res) => {
  const parsed = purchaseSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { quantity, unitCost } = parsed.data;
  const id = randomUUID();
  const now = new Date().toISOString();
  const totalCost = quantity * unitCost;

  await db.insert(purchases).values({
    id,
    ...parsed.data,
    totalCost,
    createdBy: req.admin?.id,
    createdAt: now,
  });

  // increment stock quantity on the product
  const [product] = await db.select().from(products).where(eq(products.id, parsed.data.productId));
  if (product) {
    await db
      .update(products)
      .set({ stockQuantity: (product.stockQuantity ?? 0) + quantity })
      .where(eq(products.id, parsed.data.productId));
  }

  res.status(201).json({ data: { id, ...parsed.data, totalCost, createdAt: now } });
});

// ---------- Dashboard ----------
router.get("/dashboard", requireAdmin, async (req: AuthenticatedRequest, res) => {
  const { from, to } = req.query as { from?: string; to?: string };

  const dateFilter = (col: any) => {
    const conditions = [];
    if (from) conditions.push(gte(col, from));
    if (to) conditions.push(lte(col, to));
    return conditions.length ? and(...conditions) : undefined;
  };

  const allOrders = await db.select().from(orders).where(dateFilter(orders.createdAt));
  const allPurchases = await db.select().from(purchases).where(dateFilter(purchases.date));
  const allExpenses = await db.select().from(expenses).where(dateFilter(expenses.date));

  const paidOrders = allOrders.filter((o) => o.isPaid);
  const revenueTotal = paidOrders.reduce((sum, o) => sum + o.total, 0);

  const revenueByChannel: Record<string, number> = {};
  for (const o of paidOrders) {
    const ch = o.channel ?? "site";
    revenueByChannel[ch] = (revenueByChannel[ch] ?? 0) + o.total;
  }

  const purchasesTotal = allPurchases.reduce((sum, p) => sum + p.totalCost, 0);

  const expensesTotal = allExpenses.reduce((sum, e) => sum + e.amount, 0);
  const expensesByCategory: Record<string, number> = {};
  for (const e of allExpenses) {
    expensesByCategory[e.category] = (expensesByCategory[e.category] ?? 0) + e.amount;
  }

  const netBalance = revenueTotal - purchasesTotal - expensesTotal;

  res.json({
    data: {
      period: { from: from ?? null, to: to ?? null },
      revenueTotal,
      revenueByChannel,
      purchasesTotal,
      expensesTotal,
      expensesByCategory,
      netBalance,
      ordersCount: paidOrders.length,
    },
  });
});

export default router;

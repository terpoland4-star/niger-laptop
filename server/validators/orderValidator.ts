import { z } from "zod";

export const orderSchema = z.object({
  customerName: z.string().min(2, "Nom trop court"),
  customerPhone: z.string().min(8, "Numéro de téléphone invalide"),
  deliveryAddress: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
    })
  ).min(1, "La commande doit contenir au moins un article"),
});

export type OrderInput = z.infer<typeof orderSchema>;

import { z } from "zod";

// Numéro nigérien : commence par +227 ou 227 ou 0, suivi de 8 chiffres
const phoneRegex = /^(\+?227)?[0-9]{8}$/;

export const phoneParamSchema = z
  .string()
  .regex(phoneRegex, "Numéro de téléphone invalide");

export const cartItemsSchema = z.object({
  items: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      imageUrl: z.string().optional(),
      price: z.number(),
      quantity: z.number().int().positive(),
      addedAt: z.number(),
    })
  ),
});

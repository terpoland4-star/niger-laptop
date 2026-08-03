import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";

export const orderSchema = z.object({
  customerName: z.string().min(2, "Nom trop court"),
  customerPhone: z.string().refine(
    (val) => isValidPhoneNumber(val, "NE"),
    { message: "Numéro de téléphone invalide" }
  ),
  deliveryAddress: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
    })
  ).min(1, "La commande doit contenir au moins un article"),
  // Optionnel : si fourni sans compte existant lié au token, un compte est créé automatiquement.
  createAccountEmail: z.string().email().optional(),
  createAccountPassword: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères").optional(),
});

export type OrderInput = z.infer<typeof orderSchema>;

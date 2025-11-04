import { z } from "zod";

export const salesSchema = z.object({
  customer: z.string(),
  product: z.string(),
  quantity: z.number().positive("Quantity must be a positive number"),
  price: z.number().positive("Price must be a positive number"),
});

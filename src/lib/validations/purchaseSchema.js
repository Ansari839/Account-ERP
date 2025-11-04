import { z } from "zod";

export const purchaseSchema = z.object({
  supplier: z.string(),
  item: z.string(),
  amount: z.number().positive("Amount must be a positive number"),
});

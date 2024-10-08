import { z } from "zod";

export const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string().openapi({ example: "Apple iPad" }),
  price: z.number().min(1),
});

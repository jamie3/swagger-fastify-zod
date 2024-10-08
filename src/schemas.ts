import { z } from "zod";

export type Product = z.infer<typeof productSchema>;
export type CreateProduct = z.infer<typeof createProductSchema>;

export const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string().openapi({ example: "Apple iPad" }),
  price: z.number().min(1),
});

export const getProductParamsSchema = z.object({
  productId: z.string().uuid(),
});

export const createProductSchema = z.object({
  name: z.string().openapi({ example: "Apple iPad" }),
  price: z.number().min(1),
});

import { FastifyZodOpenApiTypeProvider } from "fastify-zod-openapi";
import { buildFastifySchema } from "./fastify-response-schema";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import {
  Product,
  createProductSchema,
  getProductParamsSchema,
  productSchema,
} from "./schemas";
import { randomUUID } from "crypto";

const products: Product[] = [
  {
    id: randomUUID(),
    name: "Apple iPad",
    price: 1000,
  },
  {
    id: randomUUID(),
    name: "Samsung Galaxy",
    price: 900,
  },
];

const routes = (server: FastifyInstance) => {
  server.withTypeProvider<FastifyZodOpenApiTypeProvider>().route(
    buildFastifySchema({
      method: "GET",
      url: "/products",
      tags: ["products"],
      summary: "Fetches a list of all products",
      schema: {
        response: {
          200: z.array(productSchema),
        },
      },
      handler: async (_req, res) => {
        console.log("GET /products");

        res.status(200).send({
          data: [
            {
              id: randomUUID(),
              name: "Apple iPad",
              price: 1000,
            },
            {
              id: randomUUID(),
              name: "Samsung Galaxy",
              price: 900,
            },
          ],
        });
      },
    })
  );
  server.withTypeProvider<FastifyZodOpenApiTypeProvider>().route(
    buildFastifySchema({
      method: "GET",
      url: "/products/:productId",
      tags: ["products"],
      summary: "Fetches a product",
      schema: {
        response: {
          200: productSchema,
        },
      },
      handler: async (req, res) => {
        console.log("GET /products/:productId");

        const { productId } = getProductParamsSchema.parse(req.params);

        const product = products.find((product) => product.id === productId);

        if (!product) {
          res.status(404).send();
          return;
        }

        res.status(200).send({
          data: product,
        });
      },
    })
  );
  server.withTypeProvider<FastifyZodOpenApiTypeProvider>().route(
    buildFastifySchema({
      method: "POST",
      url: "/products",
      tags: ["products"],
      summary: "Creates a new product",
      schema: {
        request: createProductSchema,
        response: {
          201: productSchema,
        },
      },
      handler: async (req, res) => {
        console.log("POST /products", req.body);

        const newProduct = createProductSchema.parse(req.body);

        res.status(201).send({
          data: {
            id: randomUUID(),
            ...newProduct,
          },
        });
      },
    })
  );
};

export default routes;

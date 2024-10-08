import { FastifyZodOpenApiTypeProvider } from "fastify-zod-openapi";
import { buildFastifySchema } from "./fastify-response-schema";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { productSchema } from "./schemas";
import { randomUUID } from "crypto";

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
      handler: async (_req, res) => {
        console.log("GET /products/:productId");

        res.status(200).send({
          data: {
            id: randomUUID(),
            name: "Apple iPad",
            price: 1000,
          },
        });
      },
    })
  );
  /*
  server.withTypeProvider<FastifyZodOpenApiTypeProvider>().route(
    buildFastifySchema({
      method: "GET",
      url: "/products/:id",
      tags: ["products"],
      summary: "Fetches a product by ID",
      schema: {
        response: {
          200: tenantSchema,
        },
      },
      handler: async (req, res) => {
        const input = tenantIdParamSchema.parse(req.params);

        console.log(`GET /admin/tenants/${input.tenantId}`);

        const tenant = await TenantService.findTenantByExternalId(
          input.tenantId,
          { deleted: false }
        );

        if (!tenant) {
          res.status(404).send();
          return;
        }

        res.status(200).send({
          data: mapExternalId(tenant),
        });
      },
    })
  );
  /*
  server.withTypeProvider<FastifyZodOpenApiTypeProvider>().route(
    buildFastifySchema({
      method: "POST",
      url: "/products",
      tags: ["admin"],
      summary: "Creates a new product",
      schema: {
        request: createProductSchema,
        response: {
          201: tenantSchema,
        },
      },
      handler: async (req, res) => {
        console.log("POST /admin/tenants", req.body);

        const input = createTenantSchema.parse(req.body);

        const tenant = await TenantService.createTenant(input);

        console.log("returned tenant", mapExternalId(tenant));

        res.status(201).send({
          data: mapExternalId(tenant),
        });
      },
    })
  );

  server.withTypeProvider<FastifyZodOpenApiTypeProvider>().route(
    buildFastifySchema({
      method: "PATCH",
      url: "/admin/tenants/:tenantId",
      tags: ["admin"],
      summary: "Updates a tenant",
      permissions: ["tenant:read", "tenant:update"],
      schema: {
        request: updateTenantSchema,
        response: {
          200: tenantSchema,
        },
      },
      handler: async (req, res) => {
        const input = tenantIdParamSchema.parse(req.params);
        const body = updateTenantSchema.parse(req.body);

        console.log(`PATCH /admin/tenants/${input.tenantId}`);

        const tenant = await TenantService.updateTenant(input.tenantId, body);

        console.log("returned tenant", mapExternalId(tenant));

        res.status(200).send({
          data: mapExternalId(tenant),
        });
      },
    })
  );

  server.withTypeProvider<FastifyZodOpenApiTypeProvider>().route(
    buildFastifySchema({
      method: "DELETE",
      url: "/admin/tenants/:tenantId",
      tags: ["admin"],
      summary: "Deletes a tenant",
      permissions: ["tenant:read", "tenant:delete"],
      schema: {
        response: {
          204: true,
        },
      },
      handler: async (req, res) => {
        const input = tenantIdParamSchema.parse(req.params);

        console.log(`DELETE /admin/tenants/${input.tenantId}`);

        const deleted = await TenantService.deleteTenant(input.tenantId);

        if (deleted) {
          res.status(204).send(undefined);
          return;
        }

        res.status(404).send(undefined);
      },
    })
  );*/
};

export default routes;

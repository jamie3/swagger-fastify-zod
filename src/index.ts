import "zod-openapi/extend";

import cors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import fastify from "fastify";
import {
  fastifyZodOpenApiPlugin,
  fastifyZodOpenApiTransform,
  fastifyZodOpenApiTransformObject,
  serializerCompiler,
  validatorCompiler,
} from "fastify-zod-openapi";
import { ZodError } from "zod";

import routes from "./routes";

const port = 8080;
const host = "0.0.0.0";

const main = async () => {
  const server = fastify({
    logger: false,
  });

  console.log("Starting server");

  server.setValidatorCompiler(validatorCompiler);
  server.setSerializerCompiler(serializerCompiler);

  const openapi = "3.1.0";

  await server.register(fastifyZodOpenApiPlugin, { openapi });
  await server.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Example API",
        description: "Example API for Fastify, Zod, Swagger",
        version: "0.1.0",
      },
      openapi,
      tags: [
        {
          name: "products",
          description: "Products api",
        },
        {
          name: "health",
          description: "Health api",
        },
      ],
    },
    transform: fastifyZodOpenApiTransform,
    transformObject: fastifyZodOpenApiTransformObject,
  });

  await server.register(fastifySwaggerUI, {
    routePrefix: "/documentation",
  });

  server.setErrorHandler((error, _request, reply) => {
    console.log("error", error);

    if (error instanceof ZodError || error.name === "ZodError") {
      console.error(error);
      reply.status(400).send({ error });
      return;
    }

    reply.status(500).send({ error: "Internal Server Error" });
  });

  // Add the routes
  routes(server);

  await server.register(cors, {
    // put your options here
    origin: "*",
  });

  // TODO - add helment, x-xss-protection, dns-prefetch-control, hsts, ienoopen, frameguard

  server.get("/health", async () => {
    console.log("health check OK");
    return "OK";
  });

  server.listen({ host, port }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    } else {
      console.log(`server running at ${address}`);
    }
  });
};

main();

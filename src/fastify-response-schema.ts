import { HTTPMethods, RouteOptions } from "fastify";
import { FastifyZodOpenApiSchema } from "fastify-zod-openapi";
import { AnyZodObject, z, ZodSchema } from "zod";
import {
  ZodOpenApiResponseObject,
  ZodOpenApiResponsesObject,
} from "zod-openapi";

import { ErrorCode } from "./error-code";

interface ResponseCodeToZodSchemaMapping {
  200?: ZodSchema;
  201?: ZodSchema;
  204?: boolean;
}

interface RouteSchema {
  request?: AnyZodObject;
  response: ResponseCodeToZodSchemaMapping;
}

const buildSuccessContent = (schema: ZodSchema): ZodOpenApiResponseObject => {
  return {
    description: "Successful operation",
    content: {
      "application/json": {
        schema: z.object({
          data: schema,
        }),
      },
    },
  };
};

const buildSuccessNoContent = (): ZodOpenApiResponseObject => {
  return {
    description: "Delete successful",
  };
};

const buildErrorContent = (
  description: string,
  exampleCode: ErrorCode
): ZodOpenApiResponseObject => {
  return {
    description,
    content: {
      "application/json": {
        schema: z.object({
          errors: z.array(
            z.object({
              message: z.string().openapi({ example: description }),
              code: z.nativeEnum(ErrorCode).openapi({ example: exampleCode }),
            })
          ),
        }),
      },
    },
  };
};

const _400 = buildErrorContent("Bad request", ErrorCode.BAD_USER_INPUT);
const _401 = buildErrorContent(
  "Authentication required",
  ErrorCode.UNAUTHENTICATED
);
const _403 = buildErrorContent("Missing permission", ErrorCode.ACCESS_DENIED);
const _404 = buildErrorContent("Not found", ErrorCode.NOT_FOUND);
const _500 = buildErrorContent(
  "Internal server error",
  ErrorCode.INTERNAL_SERVER_ERROR
);

const buildFastifyResponse = (
  responseMapping: ResponseCodeToZodSchemaMapping,
  method: HTTPMethods
): ZodOpenApiResponsesObject => {
  let builtInContent = {};

  if (["GET", "DELETE"].includes(method)) {
    builtInContent = {
      401: _401,
      403: _403,
      404: _404,
      500: _500,
    };
  }

  if (["POST", "PUT", "PATCH"].includes(method)) {
    builtInContent = {
      400: _400,
      401: _401,
      403: _403,
      404: _404,
      500: _500,
    };
  }

  if (responseMapping[200]) {
    return {
      ...builtInContent,
      200: buildSuccessContent(responseMapping[200]),
    };
  }
  if (responseMapping[201]) {
    return {
      ...builtInContent,
      201: buildSuccessContent(responseMapping[201]),
    };
  }

  if (responseMapping[204]) {
    return {
      ...builtInContent,
      204: buildSuccessNoContent(),
    };
  }

  throw new Error(
    "Must provide a ZodSchema for 200, 201 or 204 response codes"
  );
};

const buildRouteSchema = (
  routeSchema: RouteSchema,
  method: HTTPMethods,
  tags: string[],
  summary: string
): FastifyZodOpenApiSchema => {
  return {
    tags,
    summary,
    ...(routeSchema.request ? { body: routeSchema.request } : undefined),
    response: buildFastifyResponse(routeSchema.response, method),
  } satisfies FastifyZodOpenApiSchema;
};

interface RouteConfig extends Omit<RouteOptions, "schema" | "method"> {
  method: HTTPMethods;
  schema: RouteSchema;
  tags: string[];
  summary: string;
}

const buildFastifySchema = (config: RouteConfig): RouteOptions => {
  return {
    ...config,
    schema: buildRouteSchema(
      config.schema,
      config.method,
      config.tags,
      config.summary
    ),
  };
};

export { buildFastifySchema };

import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

export const todoSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
});

export const todoContract = c.router(
  {
    create: {
      method: "POST",
      path: "/todos",
      body: todoSchema.omit({ id: true }),
      responses: {
        201: todoSchema,
      },
    },
    getAll: {
      method: "GET",
      path: "/todos",
      query: z.object({
        title: z.string().optional(),
      }),
      responses: {
        200: todoSchema.array(),
      },
    },
    getOne: {
      method: "GET",
      path: "/todos/:id",
      pathParams: z.object({
        id: z.coerce.number(),
      }),
      responses: {
        200: todoSchema,
        404: z.object({
          message: z.string(),
        }),
      },
    },
    update: {
      method: "PATCH",
      path: "/todos/:id",
      pathParams: z.object({
        id: z.coerce.number(),
      }),
      body: todoSchema.omit({ id: true }).partial(),
      responses: {
        200: todoSchema,
        404: z.object({
          message: z.string(),
        }),
      },
    },
    remove: {
      method: "DELETE",
      path: "/todos/:id",
      pathParams: z.object({
        id: z.coerce.number(),
      }),
      body: z.any(),
      responses: {
        204: z.any(),
        404: z.object({
          message: z.string(),
        }),
      },
    },
  },
  { pathPrefix: "/api" }
);

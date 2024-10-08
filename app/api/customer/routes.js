"use strict";
import controller from "./controller.js";
import { schema } from "./schema.js";

export default async function routes(fastify, options) {
  fastify.put("/:id", { schema: schema.checkParams }, controller.update);
  fastify.get("/:id", { schema: schema.checkParams }, controller.getById);
  fastify.get("/", {}, controller.get);
  // fastify.delete("/:id", {}, controller.deleteById);
}

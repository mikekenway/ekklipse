import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  snippets: defineTable({
    slug: v.string(),
    name: v.string(),
    language: v.string(),
    content: v.string(),
    createdAt: v.number(),
  }).index("slug", ["slug"]),
});

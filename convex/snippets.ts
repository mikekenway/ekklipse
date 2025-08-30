import { mutation, query } from "convex/server";
import { v } from "convex/values";
import { nanoid } from "nanoid";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("snippets").order("desc").collect();
  },
});

export const get = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("snippets")
      .withIndex("slug", (q) => q.eq("slug", slug))
      .unique();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    language: v.string(),
    content: v.string(),
  },
  handler: async (ctx, { name, language, content }) => {
    const slug = nanoid();
    const now = Date.now();
    const id = await ctx.db.insert("snippets", {
      name,
      language,
      content,
      slug,
      createdAt: now,
    });
    return await ctx.db.get(id);
  },
});

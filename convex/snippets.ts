import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { nanoid } from "nanoid";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("snippets").order("desc").collect();
  },
});

export const get = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("snippets")
      .withIndex("slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    language: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const slug = nanoid();
    const now = Date.now();
    const id = await ctx.db.insert("snippets", {
      name: args.name,
      language: args.language,
      content: args.content,
      slug,
      createdAt: now,
    });
    return await ctx.db.get(id);
  },
});

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { snippets } from "@/lib/schema";
import { nanoid } from "nanoid";

export async function GET() {
  const data = await db.select().from(snippets).orderBy(snippets.createdAt);
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const slug = nanoid();
  const [snippet] = await db
    .insert(snippets)
    .values({
      slug,
      name: body.name,
      language: body.language,
      content: body.content,
    })
    .returning();

  return NextResponse.json(snippet);
}

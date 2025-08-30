import { db } from "@/lib/db";
import { snippets } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { Snippet, SnippetClient } from "@/components/snippet-client";

interface SnippetPageProps {
  params: { slug: string };
}

async function getSnippet(slug: string): Promise<Snippet | undefined> {
  const [snippet] = await db
    .select()
    .from(snippets)
    .where(eq(snippets.slug, slug));
  return snippet as Snippet | undefined;
}

export default async function SnippetPage({ params }: SnippetPageProps) {
  const snippet = await getSnippet(params.slug);
  if (!snippet) {
    return <div className="p-4">Snippet not found.</div>;
  }

  return <SnippetClient snippet={snippet} />;
}

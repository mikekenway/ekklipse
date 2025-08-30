'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { SnippetClient } from '@/components/snippet-client';

interface SnippetPageProps {
  params: { slug: string };
}

export default function SnippetPage({ params }: SnippetPageProps) {
  const snippet = useQuery(api.snippets.get, { slug: params.slug });
  if (snippet === undefined) {
    return <div className='p-4'>Loading...</div>;
  }
  if (snippet === null) {
    return <div className='p-4'>Snippet not found.</div>;
  }
  return <SnippetClient snippet={snippet} />;
}

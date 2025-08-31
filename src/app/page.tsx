'use client';

import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from 'next-themes';
import {
  Copy,
  Download,
  Moon,
  MoonStar,
  PlusIcon,
  MinusIcon,
  ShareIcon,
  Trash,
} from 'lucide-react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface Snippet {
  _id: Id<'snippets'>;
  slug: string;
  name: string;
  language: string;
  content: string;
}

const languages = [
  'typescript',
  'javascript',
  'python',
  'jsx',
  'csharp',
  'yaml',
  'xml',
  'markdown',
  'text',
];

const extMap: Record<string, string> = {
  typescript: 'ts',
  javascript: 'js',
  python: 'py',
  jsx: 'jsx',
  csharp: 'cs',
  yaml: 'yml',
  xml: 'xml',
  markdown: 'md',
  text: 'txt',
};

export default function Home() {
  const { theme } = useTheme();
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('text');
  const [content, setContent] = useState('');
  const snippets = useQuery(api.snippets.list) || [];
  const createSnippet = useMutation(api.snippets.create);
  const deleteSnippet = useMutation(api.snippets.remove);
  const [showNew, setShowNew] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const saveSnippet = async () => {
    if (!title.trim() || !content.trim()) return;
    await createSnippet({ name: title, language, content });
    setTitle('');
    setContent('');
    setLanguage('markdown');
    setShowNew(false);
  };

  const download = (snip: Snippet) => {
    const ext = extMap[snip.language] ?? 'txt';
    const blob = new Blob([snip.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${snip.name}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const share = (snip: Snippet) => {
    const url = `${window.location.origin}/${snip.slug}`;
    if (navigator.share) {
      navigator.share({ url });
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <div className='min-h-screen flex flex-col items-center pt-24 p-4'>
      <h1 className='my-30 text-5xl font-bold flex items-center gap-2'>
        <MoonStar className='size-14 mr-2' />
        <span className='text-foreground/60'>ek</span>(klip)
        <span className='text-foreground/60'>se</span>
      </h1>
      <div className='w-full max-w-3xl space-y-4'>
        <div className='rounded-xl border border-foreground/20 overflow-hidden'>
          <button
            onClick={() => setShowNew(!showNew)}
            className='flex w-full items-center justify-between p-4 cursor-pointer hover:bg-foreground/5 transition-colors'
          >
            <span className='flex items-center gap-2'>
              <Moon className='size-5' />
              New Klip
            </span>
            {showNew ? <MinusIcon className='size-4' /> : <PlusIcon className='size-4' />}
          </button>
          {showNew && (
            <div className='flex flex-col space-y-4 border-t border-foreground/20 p-6 bg-background'>
              <div className='flex flex-row gap-2'>
                <Input
                  className='h-10 rounded-md'
                  placeholder='Name'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className='h-10 rounded-md w-1/4'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {language === 'text' ? (
                <Textarea
                  className='h-[20vh] resize-y rounded-md'
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              ) : (
                <div className='h-[20vh] resize-y rounded-xl border border-foreground/20 overflow-hidden'>
                  <Editor
                    height='100%'
                    theme={theme === 'dark' ? 'vs-dark' : 'light'}
                    language={language}
                    value={content}
                    onChange={(v) => setContent(v ?? '')}
                    options={{
                      minimap: { enabled: false },
                      lineNumbers: 'on',
                      automaticLayout: true,
                    }}
                  />
                </div>
              )}
              <div className='flex justify-end'>
                <Button className='rounded-md cursor-pointer' onClick={saveSnippet}>
                  Save Klip
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className=''>
          {snippets.map((snip) => (
            <div
              key={snip._id}
              onClick={() => setExpandedId(expandedId === snip._id ? null : snip._id)}
              className={cn(
                'rounded-md border border-foreground/20 p-2 pl-4 cursor-pointer hover:bg-foreground/5 transition-colors mb-4',
                expandedId === snip._id && 'bg-foreground/10 pb-6'
              )}
            >
              <div className='flex items-center justify-between'>
                <Link
                  href={`/${snip.slug}`}
                  className='font-medium'
                  onClick={(e) => e.stopPropagation()}
                >
                  {snip.name}
                </Link>
                <div className='flex items-center gap-1'>
                  <span className='text-sm text-foreground/60 mr-2'>
                    {extMap[snip.language] ?? snip.language}
                  </span>
                  <Button
                    className='icon-hover'
                    variant='ghost'
                    size='icon'
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(snip.content);
                    }}
                  >
                    <Copy className='size-4' />
                  </Button>
                  <Button
                    className='icon-hover'
                    variant='ghost'
                    size='icon'
                    onClick={(e) => {
                      e.stopPropagation();
                      download(snip);
                    }}
                  >
                    <Download className='size-4' />
                  </Button>
                  <Button
                    className='icon-hover'
                    variant='ghost'
                    size='icon'
                    onClick={(e) => {
                      e.stopPropagation();
                      share(snip);
                    }}
                  >
                    <ShareIcon className='size-4' />
                  </Button>
                  <Button
                    className='icon-hover hover:text-red-500'
                    variant='ghost'
                    size='icon'
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSnippet({ id: snip._id });
                    }}
                  >
                    <Trash className='size-4' />
                  </Button>
                </div>
              </div>
              {expandedId === snip._id && (
                <div className='mt-4'>
                  {snip.language === 'markdown' ? (
                    <div className='rounded-md border border-foreground/20 p-4'>
                      <ReactMarkdown>{snip.content}</ReactMarkdown>
                    </div>
                  ) : snip.language === 'text' ? (
                    <pre className='rounded-md border border-foreground/20 p-4 whitespace-pre-wrap mr-2'>
                      {snip.content}
                    </pre>
                  ) : (
                    <div className='rounded-md border border-foreground/20 overflow-hidden'>
                      <Editor
                        value={snip.content}
                        language={snip.language}
                        theme={theme === 'dark' ? 'vs-dark' : 'light'}
                        options={{ readOnly: true, minimap: { enabled: false } }}
                        height='40vh'
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

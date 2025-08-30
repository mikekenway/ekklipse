"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "next-themes";
import { Copy, Download, Share2 } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import Link from "next/link";

interface Snippet {
  _id: string;
  slug: string;
  name: string;
  language: string;
  content: string;
}

const languages = [
  "typescript",
  "javascript",
  "python",
  "jsx",
  "csharp",
  "yaml",
  "xml",
  "markdown",
  "text",
];

export default function Home() {
  const { theme } = useTheme();
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("markdown");
  const [content, setContent] = useState("");
  const snippets = useQuery<Snippet[]>("snippets:list") || [];
  const createSnippet = useMutation("snippets:create");

  const saveSnippet = async () => {
    if (!title.trim() || !content.trim()) return;
    await createSnippet({ name: title, language, content });
    setTitle("");
    setContent("");
  };

  const download = (snip: Snippet) => {
    const map: Record<string, string> = {
      typescript: "ts",
      javascript: "js",
      python: "py",
      jsx: "jsx",
      csharp: "cs",
      yaml: "yml",
      xml: "xml",
      markdown: "md",
      text: "txt",
    };
    const ext = map[snip.language] ?? "txt";
    const blob = new Blob([snip.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
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
    <div className="min-h-screen flex flex-col items-center pt-24 p-4">
      <h1 className="mb-8 text-5xl font-bold">ek(klip)se</h1>
      <div className="w-full max-w-3xl space-y-8">
          <div className="space-y-4 rounded-2xl border border-foreground/20 p-6 bg-background">
            <h2 className="text-center text-xl font-semibold">New snippet</h2>
            <Input
              className="rounded-xl"
              placeholder="Snippet title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="rounded-xl">
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
            {language === "markdown" || language === "text" ? (
              <Textarea
                className="h-[20vh] resize-y rounded-xl"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            ) : (
              <div className="h-[20vh] resize-y rounded-xl border border-foreground/20 overflow-hidden">
                <Editor
                  height="100%"
                  theme={theme === "dark" ? "vs-dark" : "light"}
                  language={language}
                  value={content}
                  onChange={(v) => setContent(v ?? "")}
                  options={{
                    minimap: { enabled: false },
                    lineNumbers: "on",
                    automaticLayout: true,
                  }}
                />
              </div>
            )}
            <div className="flex justify-end">
              <Button className="rounded-xl" onClick={saveSnippet}>
                Save
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            {snippets.map((snip) => (
              <div
                key={snip._id}
                className="relative rounded-2xl border border-foreground/20 p-4"
              >
                <div className="flex items-center justify-between pr-24">
                  <Link href={`/${snip.slug}`} className="font-medium">
                    {snip.name}
                  </Link>
                  <span className="text-sm text-foreground/60">
                    {snip.language}
                  </span>
                </div>
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigator.clipboard.writeText(snip.content)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => download(snip)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => share(snip)}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
      </div>
    </div>
  );
}

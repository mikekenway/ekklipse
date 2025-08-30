"use client";

import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { Copy } from "lucide-react";

interface Snippet {
  id: number;
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
  const [language, setLanguage] = useState("typescript");
  const [content, setContent] = useState("");
  const [snippets, setSnippets] = useState<Snippet[]>([]);

  useEffect(() => {
    fetch("/api/snippets")
      .then((res) => res.json())
      .then(setSnippets);
  }, []);

  const saveSnippet = async () => {
    const res = await fetch("/api/snippets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: title, language, content }),
    });
    const data = await res.json();
    setSnippets([...snippets, data]);
    setTitle("");
    setContent("");
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Input
          placeholder="Snippet title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          className="border border-foreground bg-background text-foreground p-2 rounded w-full"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
        <Editor
          height="40vh"
          theme={theme === "dark" ? "vs-dark" : "light"}
          language={language}
          value={content}
          onChange={(v) => setContent(v ?? "")}
          options={{ minimap: { enabled: false }, lineNumbers: "on" }}
        />
        <Button onClick={saveSnippet}>Save</Button>
      </div>
      <div className="space-y-2">
        {snippets.map((snip) => (
          <div key={snip.id} className="relative border p-2 rounded">
            <a href={`/${snip.slug}`} className="font-medium">
              {snip.name}
            </a>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => navigator.clipboard.writeText(snip.content)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

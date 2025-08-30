"use client";

import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Copy, Download, Share2 } from "lucide-react";
import { useTheme } from "next-themes";

export interface Snippet {
  id: number;
  slug: string;
  name: string;
  language: string;
  content: string;
  createdAt: Date;
}

export function SnippetClient({ snippet }: { snippet: Snippet }) {
  const { theme } = useTheme();

  const download = () => {
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
    const ext = map[snippet.language] ?? "txt";
    const blob = new Blob([snippet.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${snippet.name}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const share = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ url });
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">{snippet.name}</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => navigator.clipboard.writeText(snippet.content)}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={download}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={share}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Editor
        value={snippet.content}
        language={snippet.language}
        theme={theme === "dark" ? "vs-dark" : "light"}
        options={{ readOnly: true, minimap: { enabled: false } }}
        height="60vh"
      />
    </div>
  );
}

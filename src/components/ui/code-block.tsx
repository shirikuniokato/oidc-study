"use client";

import { useCallback, useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  readonly code: string;
  readonly language?: string;
  readonly title?: string;
  readonly className?: string;
}

function CodeBlock({ code, language, title, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div
      className={cn("rounded-lg border border-border bg-zinc-900", className)}
    >
      {(title || language) && (
        <div className="flex items-center justify-between border-b border-border px-4 py-2">
          <span className="text-xs text-muted-foreground">
            {title ?? language}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="コピー"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
      )}
      <pre className="overflow-x-auto p-4">
        <code className="text-sm leading-relaxed text-zinc-300">{code}</code>
      </pre>
    </div>
  );
}

export { CodeBlock };
export type { CodeBlockProps };

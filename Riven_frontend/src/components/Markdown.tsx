import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

/** Модели часто пишут формулы как \( ... \) и \[ ... \] — приводим к $...$ и $$...$$. */
function normalizeMath(text: string): string {
  return text
    .replace(/\\\[([\s\S]+?)\\\]/g, (_, m) => `\n$$\n${m.trim()}\n$$\n`)
    .replace(/\\\(([\s\S]+?)\\\)/g, (_, m) => `$${m.trim()}$`)
    // $$...$$ в одну строку remark считает строчной формулой — выносим в отдельный блок
    .replace(/\$\$([^\n$]+?)\$\$/g, (_, m) => `\n$$\n${m.trim()}\n$$\n`);
}

/** Markdown + формулы LaTeX. Ссылки открываются в новой вкладке, сырой HTML не допускается. */
export const Markdown = memo(function Markdown({ text }: { text: string }) {
  return (
    <div className="md">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[[rehypeKatex, { strict: "ignore", throwOnError: false }]]}
        components={{
          a: ({ node: _n, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
        }}
      >
        {normalizeMath(text)}
      </ReactMarkdown>
    </div>
  );
});

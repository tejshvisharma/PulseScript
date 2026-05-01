import { useEffect, useMemo, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import { getLanguageLabel } from "../utils/languages";
import "./Editor.css";

const PREVIEW_LANGUAGES = new Set(["html", "markdown"]);

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const renderInlineMarkdown = (value) =>
  value
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noreferrer">$1</a>',
    );

const markdownToHtml = (markdown) => {
  const lines = markdown.split(/\r?\n/);
  const chunks = [];
  const listItems = [];
  let activeListTag = "";
  let inCodeBlock = false;
  const codeLines = [];

  const flushList = () => {
    if (!activeListTag || listItems.length === 0) {
      return;
    }
    chunks.push(`<${activeListTag}>${listItems.join("")}</${activeListTag}>`);
    listItems.length = 0;
    activeListTag = "";
  };

  const flushCode = () => {
    chunks.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
    codeLines.length = 0;
  };

  lines.forEach((line) => {
    if (line.trim().startsWith("```")) {
      flushList();
      if (inCodeBlock) {
        flushCode();
      }
      inCodeBlock = !inCodeBlock;
      return;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      return;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushList();
      const level = headingMatch[1].length;
      const content = renderInlineMarkdown(escapeHtml(headingMatch[2]));
      chunks.push(`<h${level}>${content}</h${level}>`);
      return;
    }

    const orderedMatch = line.match(/^\d+\.\s+(.+)$/);
    if (orderedMatch) {
      if (activeListTag && activeListTag !== "ol") {
        flushList();
      }
      activeListTag = "ol";
      listItems.push(
        `<li>${renderInlineMarkdown(escapeHtml(orderedMatch[1]))}</li>`,
      );
      return;
    }

    const unorderedMatch = line.match(/^[-*]\s+(.+)$/);
    if (unorderedMatch) {
      if (activeListTag && activeListTag !== "ul") {
        flushList();
      }
      activeListTag = "ul";
      listItems.push(
        `<li>${renderInlineMarkdown(escapeHtml(unorderedMatch[1]))}</li>`,
      );
      return;
    }

    flushList();

    if (line.trim() === "") {
      return;
    }

    if (line.startsWith("> ")) {
      chunks.push(
        `<blockquote>${renderInlineMarkdown(escapeHtml(line.slice(2)))}</blockquote>`,
      );
      return;
    }

    chunks.push(`<p>${renderInlineMarkdown(escapeHtml(line))}</p>`);
  });

  if (inCodeBlock) {
    flushCode();
  }
  flushList();

  return chunks.join("\n");
};

const buildPreviewDocument = (language, source) => {
  if (language === "html") {
    return source;
  }

  const renderedMarkdown = markdownToHtml(source);
  return `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      :root {
        color-scheme: dark;
      }
      body {
        margin: 0;
        padding: 20px;
        font-family: "Inter", "Segoe UI", sans-serif;
        background: #090b12;
        color: #e5e7eb;
        line-height: 1.55;
      }
      h1, h2, h3, h4, h5, h6 {
        margin: 0 0 12px;
        color: #f5f6fb;
      }
      p, ul, ol, blockquote, pre {
        margin: 0 0 12px;
      }
      ul, ol {
        padding-left: 20px;
      }
      blockquote {
        margin-left: 0;
        padding: 10px 12px;
        border-left: 3px solid #22d3ee;
        background: rgba(34, 211, 238, 0.1);
      }
      code {
        padding: 1px 6px;
        border-radius: 6px;
        background: #1f2937;
        font-family: "JetBrains Mono", monospace;
        font-size: 0.9em;
      }
      pre {
        overflow-x: auto;
        border-radius: 10px;
        border: 1px solid #374151;
        background: #111827;
        padding: 12px;
      }
      pre code {
        padding: 0;
        background: transparent;
      }
      a {
        color: #22d3ee;
      }
    </style>
  </head>
  <body>
    ${renderedMarkdown}
  </body>
</html>`;
};

function Editor({
  yText,
  provider,
  language,
  room,
  username,
  isSidebarOpen,
  isFocusMode = false,
  onToggleSidebar,
  onExport,
}) {
  const [editorInstance, setEditorInstance] = useState(null);
  const [monacoInstance, setMonacoInstance] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewSource, setPreviewSource] = useState("");

  const previewSupported = PREVIEW_LANGUAGES.has(language);
  const languageLabel = useMemo(() => getLanguageLabel(language), [language]);
  const previewDocument = useMemo(
    () => buildPreviewDocument(language, previewSource),
    [language, previewSource],
  );

  useEffect(() => {
    if (!editorInstance || !yText || !provider) {
      return undefined;
    }

    const model = editorInstance.getModel();
    if (!model) {
      return undefined;
    }

    const binding = new MonacoBinding(
      yText,
      model,
      new Set([editorInstance]),
      provider.awareness,
    );

    return () => {
      binding.destroy();
    };
  }, [editorInstance, provider, yText]);

  useEffect(() => {
    if (!editorInstance || !monacoInstance) {
      return;
    }

    const model = editorInstance.getModel();
    if (!model) {
      return;
    }

    monacoInstance.editor.setModelLanguage(model, language);

    const timeoutId = window.setTimeout(() => {
      const formatAction = editorInstance.getAction(
        "editor.action.formatDocument",
      );
      if (formatAction) {
        formatAction.run().catch(() => {});
      }
    }, 120);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [editorInstance, language, monacoInstance]);

  useEffect(() => {
    if (!previewSupported) {
      setShowPreview(false);
    }
  }, [previewSupported]);

  useEffect(() => {
    if (!editorInstance) {
      return;
    }

    const model = editorInstance.getModel();
    if (!model) {
      return;
    }

    setPreviewSource(model.getValue());
    const disposable = model.onDidChangeContent(() => {
      setPreviewSource(model.getValue());
    });

    return () => {
      disposable.dispose();
    };
  }, [editorInstance]);

  return (
    <section
      className={`ps-editor-shell flex min-h-[calc(100dvh-5rem)] flex-1 flex-col overflow-hidden border border-slate-700/80 bg-slate-900/80 shadow-xl ring-1 ring-white/5 lg:min-h-0 ${
        isFocusMode
          ? "rounded-none border-0 shadow-none ring-0 lg:min-h-dvh"
          : "rounded-2xl"
      }`}
    >
      <header className="hidden lg:flex lg:items-center lg:justify-between lg:gap-3 lg:border-b lg:border-slate-700 lg:bg-slate-900/95 lg:px-4 lg:py-3">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-100 transition hover:border-indigo-500/60 hover:text-indigo-200"
            aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={isSidebarOpen}
          >
            {isSidebarOpen ? "Hide Panel" : "Show Panel"}
          </button>

          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-slate-100">
              Room {room}
            </h2>
            <p className="truncate text-xs text-slate-400">
              Editing as {username}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-300">
            {languageLabel}
          </span>
          {previewSupported ? (
            <button
              type="button"
              onClick={() => setShowPreview((prev) => !prev)}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-100 transition hover:border-indigo-500/60 hover:text-indigo-200"
            >
              {showPreview ? "Hide Preview" : "Show Preview"}
            </button>
          ) : null}
          <button
            type="button"
            onClick={onExport}
            className="rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-indigo-400"
          >
            Export File
          </button>
        </div>
      </header>

      <div
        className={`flex-1 overflow-auto ${
          isFocusMode ? "p-0" : "p-2 sm:p-3"
        } ${
          previewSupported && showPreview ? "grid gap-3 md:grid-cols-2" : ""
        }`}
      >
        <div
          className={`h-full min-h-90 overflow-hidden border border-slate-700 bg-slate-950/90 ${
            isFocusMode ? "rounded-none border-0" : "rounded-xl"
          }`}
        >
          <MonacoEditor
            height="100%"
            theme="vs-dark"
            defaultLanguage="javascript"
            options={{
              fontSize: 14,
              lineHeight: 22,
              minimap: { enabled: true },
              smoothScrolling: true,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              semanticHighlighting: { enabled: true },
              suggestOnTriggerCharacters: true,
              quickSuggestions: { other: true, comments: true, strings: true },
              acceptSuggestionOnEnter: "on",
              tabCompletion: "on",
              wordWrap: language === "markdown" ? "on" : "off",
              bracketPairColorization: { enabled: true },
              codeLens: true,
              tabSize: 2,
              cursorBlinking: "phase",
              fixedOverflowWidgets: true,
              padding: { top: 18, bottom: 18 },
              scrollbar: {
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10,
              },
            }}
            onMount={(editor, monaco) => {
              setEditorInstance(editor);
              setMonacoInstance(monaco);
            }}
          />
        </div>

        {previewSupported && showPreview ? (
          <div
            className={`h-full min-h-90 overflow-hidden border border-slate-700 bg-slate-950/90 ${
              isFocusMode ? "rounded-none border-0" : "rounded-xl"
            }`}
          >
            <iframe
              title="Live preview"
              sandbox="allow-scripts allow-same-origin"
              className="h-full w-full border-0"
              srcDoc={previewDocument}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default Editor;

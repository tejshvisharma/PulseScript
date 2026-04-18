import { useEffect, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";

const LANGUAGE_OPTIONS = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
  { value: "java", label: "Java" },
];

function Editor({
  yText,
  provider,
  language,
  room,
  username,
  isSidebarOpen,
  onToggleSidebar,
  onExport,
}) {
  const [editorInstance, setEditorInstance] = useState(null);
  const [monacoInstance, setMonacoInstance] = useState(null);

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
  }, [editorInstance, language, monacoInstance]);

  return (
    <section className="flex min-h-[60vh] flex-1 flex-col overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-900/70 shadow-2xl ring-1 ring-white/5 backdrop-blur md:min-h-0">
      <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 bg-neutral-900/95 px-3 py-3 backdrop-blur sm:px-4 sm:py-3.5">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-100 transition hover:border-cyan-500/60 hover:text-cyan-200"
            aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={isSidebarOpen}
          >
            {isSidebarOpen ? "Hide Panel" : "Show Panel"}
          </button>

          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-neutral-100">
              Room {room}
            </h2>
            <p className="truncate text-xs text-neutral-400">
              Editing as {username}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-lg border border-neutral-700 bg-neutral-800 px-2.5 py-1 text-xs text-neutral-300">
            {LANGUAGE_OPTIONS.find((option) => option.value === language)
              ?.label || "Unknown"}
          </span>
          <button
            type="button"
            onClick={onExport}
            className="rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-neutral-950 transition hover:bg-cyan-400"
          >
            Export File
          </button>
        </div>
      </header>

      <div className="flex-1 p-3 pt-2">
        <div className="h-full overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950/90">
          <MonacoEditor
            height="100%"
            theme="vs-dark"
            defaultLanguage="javascript"
            options={{
              fontSize: 14,
              lineHeight: 22,
              minimap: { enabled: false },
              smoothScrolling: true,
              automaticLayout: true,
              tabSize: 2,
              cursorBlinking: "phase",
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
      </div>
    </section>
  );
}

export default Editor;

import Editor from "@monaco-editor/react";
import "./CodeEditor.css";

const SUPPORTED_LANGUAGES = [
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "Python", value: "python" },
  { label: "Java", value: "java" },
  { label: "C++", value: "cpp" },
];

function CodeEditor({ language, onLanguageChange, value, onChange }) {
  return (
    <div className="code-editor">
      <header className="code-editor__toolbar">
        <div>
          <h2>Collaborative Editor</h2>
          <p>UI scaffold ready for real-time backend events</p>
        </div>

        <label
          className="code-editor__language-select"
          htmlFor="language-select"
        >
          Language
          <select
            id="language-select"
            value={language}
            onChange={(event) => onLanguageChange(event.target.value)}
          >
            {SUPPORTED_LANGUAGES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </header>

      <div className="code-editor__surface">
        <Editor
          height="100%"
          language={language}
          value={value}
          onChange={(nextValue) => onChange(nextValue ?? "")}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            wordWrap: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
          }}
        />
      </div>
    </div>
  );
}

export default CodeEditor;

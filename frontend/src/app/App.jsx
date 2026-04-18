import { useMemo, useState } from "react";
import CodeEditor from "../components/CodeEditor/CodeEditor";
import UserList from "../components/UserList/UserList";
import "./App.css";

const INITIAL_CODE = [
  "// Welcome to MultiCode",
  "function greet(name) {",
  "  return `Hello, ${name}!`;",
  "}",
].join("\n");

function App() {
  // Placeholder local state for the UI scaffold.
  const [connectedUsers] = useState([
    { id: "u1", name: "Olivia", status: "online" },
    { id: "u2", name: "Noah", status: "online" },
    { id: "u3", name: "Ava", status: "idle" },
    { id: "u4", name: "Liam", status: "online" },
  ]);
  const [activeUserId] = useState("u1");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(INITIAL_CODE);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [connectionState] = useState("Connected");

  const onlineCount = useMemo(
    () => connectedUsers.filter((user) => user.status === "online").length,
    [connectedUsers],
  );

  const connectionClassName =
    connectionState === "Connected"
      ? "status-pill status-pill--ok"
      : "status-pill";

  return (
    <main className="app-shell">
      <header className="status-bar" aria-label="Session status bar">
        <div className={connectionClassName}>{connectionState}</div>
        <p>{onlineCount} active collaborators</p>
        <button
          type="button"
          className="sidebar-toggle"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          aria-expanded={isSidebarOpen}
          aria-controls="connected-users-panel"
        >
          {isSidebarOpen ? "Hide Users" : "Show Users"}
        </button>
      </header>

      {/* Sidebar is always visible on desktop and toggled as an overlay on mobile. */}
      <aside
        id="connected-users-panel"
        className={`sidebar-panel ${isSidebarOpen ? "sidebar-panel--open" : ""}`}
        aria-label="Connected users"
      >
        <UserList
          users={connectedUsers}
          activeUserId={activeUserId}
          onlineCount={onlineCount}
        />
      </aside>

      <button
        type="button"
        className={`sidebar-backdrop ${isSidebarOpen ? "sidebar-backdrop--visible" : ""}`}
        aria-label="Close users panel"
        onClick={() => setIsSidebarOpen(false)}
      />

      <section className="editor-panel" aria-label="Collaborative code editor">
        <CodeEditor
          language={language}
          onLanguageChange={setLanguage}
          value={code}
          onChange={setCode}
        />
      </section>
    </main>
  );
}

export default App;

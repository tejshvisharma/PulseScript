import { useEffect, useMemo, useRef, useState } from "react";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";
import Editor from "../components/Editor";
import Sidebar from "../components/Sidebar";
import LandingPage from "../components/Landing/LandingPage";
import JoinModal from "../components/Landing/JoinModal";
import { getLanguageExtension, getLanguageLabel } from "../utils/languages";
import {
  formatMessageTime,
  getOrCreateTabClientId,
  getUserColor,
  parseSessionFromUrl,
  upsertSessionInUrl,
} from "../utils/helpers";
import "./App.css";

function App() {
  const [session, setSession] = useState(() => parseSessionFromUrl());
  const [formSession, setFormSession] = useState(() => ({
    username: session.username,
    room: session.room,
  }));

  const [language, setLanguage] = useState("javascript");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [copyState, setCopyState] = useState("Copy Link");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [joinError, setJoinError] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(
    Boolean(session.room || session.username),
  );

  const [realtime, setRealtime] = useState(() => ({
    doc: null,
    provider: null,
    yText: null,
    metaMap: null,
    chatArray: null,
  }));

  const chatScrollRef = useRef(null);
  const clientIdRef = useRef(getOrCreateTabClientId());
  const clientId = clientIdRef.current;

  const sessionReady = Boolean(session.username && session.room);
  const languageLabel = useMemo(() => getLanguageLabel(language), [language]);

  const socketUrl = useMemo(() => {
    const envUrl = import.meta.env.VITE_SOCKET_URL;
    if (envUrl) return envUrl;

    if (typeof window === "undefined") return "http://localhost:3001";

    const protocol = window.location.protocol === "https:" ? "https:" : "http:";
    const { hostname, port } = window.location;

    if (!port || port === "3001") return `${protocol}//${window.location.host}`;
    return `${protocol}//${hostname}:3001`;
  }, []);

  useEffect(() => {
    if (sessionReady) {
      setIsJoinModalOpen(false);
    }
  }, [sessionReady]);

  useEffect(() => {
    if (typeof document === "undefined" || !sessionReady) {
      return;
    }

    document.body.classList.toggle("ps-sidebar-open", isSidebarOpen);

    return () => {
      document.body.classList.remove("ps-sidebar-open");
    };
  }, [isSidebarOpen, sessionReady]);

  useEffect(() => {
    if (!sessionReady || !isSidebarOpen || typeof window === "undefined") {
      return;
    }

    const handleEscClose = (event) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscClose);
    return () => {
      window.removeEventListener("keydown", handleEscClose);
    };
  }, [isSidebarOpen, sessionReady]);

  useEffect(() => {
    setFormSession({ username: session.username, room: session.room });
  }, [session.username, session.room]);

  useEffect(() => {
    if (!sessionReady) {
      return undefined;
    }

    const doc = new Y.Doc();
    const provider = new SocketIOProvider(socketUrl, session.room, doc, {
      autoConnect: true,
      auth: {
        username: session.username,
        clientId,
      },
      transports: ["websocket"],
    });

    const yText = doc.getText("monaco");
    const metaMap = doc.getMap("meta");
    const chatArray = doc.getArray("chat");

    if (!metaMap.get("language")) {
      metaMap.set("language", "javascript");
    }
    if (!metaMap.get("theme")) {
      metaMap.set("theme", "vs-dark");
    }

    provider.awareness.setLocalStateField("user", {
      name: session.username,
      color: getUserColor(session.username),
    });
    provider.awareness.setLocalStateField("typing", false);

    const handleProviderConnectError = (error) => {
      const message = String(error?.message || "").toLowerCase();
      if (!message.includes("username") || !message.includes("taken")) {
        return;
      }

      setJoinError(
        "Username already exists in this room. Choose a different name.",
      );
      setSession({ username: "", room: session.room });
      upsertSessionInUrl("", session.room);
      setIsJoinModalOpen(true);
    };

    const syncLanguage = () => {
      setLanguage(metaMap.get("language") || "javascript");
    };

    const syncMessages = () => {
      setMessages(chatArray.toArray());
    };

    const syncUsers = () => {
      const nextUsers = [];
      const nextTypingUsers = [];

      provider.awareness.getStates().forEach((state, awarenessClientId) => {
        const user = state?.user;
        if (!user?.name) {
          return;
        }

        nextUsers.push({
          id: String(awarenessClientId),
          name: user.name,
          color: user.color || getUserColor(user.name),
          isSelf: user.name === session.username,
        });

        if (state?.typing && user.name !== session.username) {
          nextTypingUsers.push(user.name);
        }
      });

      nextUsers.sort((a, b) => a.name.localeCompare(b.name));
      nextTypingUsers.sort((a, b) => a.localeCompare(b));

      setUsers(nextUsers);
      setTypingUsers([...new Set(nextTypingUsers)]);
    };

    metaMap.observe(syncLanguage);
    chatArray.observe(syncMessages);
    provider.awareness.on("change", syncUsers);
    provider.socket.on("connect_error", handleProviderConnectError);

    syncLanguage();
    syncMessages();
    syncUsers();

    setRealtime({ doc, provider, yText, metaMap, chatArray });

    return () => {
      metaMap.unobserve(syncLanguage);
      chatArray.unobserve(syncMessages);
      provider.awareness.off("change", syncUsers);
      provider.socket.off("connect_error", handleProviderConnectError);
      provider.awareness.setLocalState(null);
      provider.destroy();
      doc.destroy();
      setRealtime({
        doc: null,
        provider: null,
        yText: null,
        metaMap: null,
        chatArray: null,
      });
      setUsers([]);
      setTypingUsers([]);
      setMessages([]);
    };
  }, [clientId, session.room, session.username, sessionReady, socketUrl]);

  useEffect(() => {
    const awareness = realtime.provider?.awareness;
    if (!awareness || !sessionReady) {
      return;
    }

    const hasText = Boolean(chatInput.trim());
    if (!hasText) {
      awareness.setLocalStateField("typing", false);
      return;
    }

    awareness.setLocalStateField("typing", true);

    const timeoutId = window.setTimeout(() => {
      awareness.setLocalStateField("typing", false);
    }, 1200);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [chatInput, realtime.provider, sessionReady]);

  useEffect(() => {
    if (!chatScrollRef.current) {
      return;
    }
    chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
  }, [messages]);

  const isConnected = realtime.provider?.socket?.connected ?? false;

  const checkUsernameAvailability = async (room, username) => {
    try {
      const params = new URLSearchParams({ room, username });
      const res = await fetch(`/api/username-available?${params}`, {
        signal: AbortSignal.timeout(4000),
      });
      if (!res.ok) return { available: false, reason: "connection" };
      return res.json();
    } catch {
      return { available: false, reason: "connection" };
    }
  };

  const joinSession = async (event) => {
    event.preventDefault();
    const username = formSession.username.trim();
    const room = formSession.room.trim();
    setJoinError("");

    if (!username || !room) {
      setJoinError("Please enter both username and room.");
      return;
    }

    setIsCheckingUsername(true);
    const availability = await checkUsernameAvailability(room, username);
    setIsCheckingUsername(false);

    if (!availability.available) {
      if (availability.reason === "taken") {
        setJoinError(
          "Username already exists in this room. Choose a different name.",
        );
      } else {
        setJoinError(
          "Could not verify room users right now. Please try again.",
        );
      }
      return;
    }

    upsertSessionInUrl(username, room);
    setSession({ username, room });
    setIsJoinModalOpen(false);
  };

  const copyRoomLink = async () => {
    try {
      const roomOnlyUrl = new URL(window.location.href);
      roomOnlyUrl.searchParams.set("room", session.room);
      roomOnlyUrl.searchParams.delete("username");
      await navigator.clipboard.writeText(roomOnlyUrl.toString());
      setCopyState("Copied");
      window.setTimeout(() => setCopyState("Copy Link"), 1200);
    } catch {
      setCopyState("Copy failed");
      window.setTimeout(() => setCopyState("Copy Link"), 1200);
    }
  };

  const handleLanguageChange = (nextLanguage) => {
    setLanguage(nextLanguage);
    if (realtime.metaMap) {
      realtime.metaMap.set("language", nextLanguage);
    }
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    const text = chatInput.trim();
    if (!text || !realtime.chatArray) {
      return;
    }

    realtime.chatArray.push([
      {
        text,
        user: session.username,
        time: Date.now(),
      },
    ]);
    setChatInput("");
    if (realtime.provider?.awareness) {
      realtime.provider.awareness.setLocalStateField("typing", false);
    }
  };

  const handleExportCode = () => {
    if (!realtime.yText) {
      return;
    }

    const code = realtime.yText.toString();
    const extension = getLanguageExtension(language);
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pulsescript-${session.room}.${extension}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const scrollToSection = (sectionId) => {
    if (typeof document === "undefined") {
      return;
    }

    const sectionNode = document.getElementById(sectionId);
    if (sectionNode) {
      sectionNode.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const openJoinModal = (roomName) => {
    setJoinError("");

    if (roomName) {
      setFormSession((prev) => ({
        ...prev,
        room: roomName,
      }));
    }

    setIsJoinModalOpen(true);
  };

  const startRoom = () => {
    const randomRoom = `room-${Math.random().toString(36).slice(2, 8)}`;
    const roomName = formSession.room.trim() || randomRoom;
    openJoinModal(roomName);
  };

  const connectedCount = useMemo(() => users.length, [users]);
  const showUsersSkeleton = !isConnected && users.length === 0;
  const showMessagesSkeleton = !isConnected && messages.length === 0;

  if (sessionReady) {
    return (
      <div className="relative min-h-dvh overflow-hidden bg-slate-950 text-slate-100">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-indigo-500/14 blur-3xl" />
          <div className="absolute -bottom-20 right-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        </div>

        {isSidebarOpen ? (
          <button
            type="button"
            aria-label="Close sidebar"
            className="fixed inset-0 z-30 bg-slate-950/65 backdrop-blur-md lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        ) : null}

        <div className="relative z-10 min-h-dvh w-full">
          <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-700/70 bg-slate-900/95 px-3 py-2.5 backdrop-blur-md lg:hidden">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsSidebarOpen((prev) => !prev)}
                className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-100 transition hover:border-indigo-400/70 hover:text-indigo-200"
                aria-label={isSidebarOpen ? "Hide panel" : "Show panel"}
                aria-expanded={isSidebarOpen}
              >
                {isSidebarOpen ? "Hide Panel" : "Show Panel"}
              </button>

              <div className="min-w-0 flex-1 text-center">
                <p className="truncate text-sm font-semibold text-slate-100">
                  Room {session.room}
                </p>
                <p className="truncate text-xs text-slate-400">
                  {session.username}
                </p>
              </div>

              <span className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-2 py-1 text-xs text-indigo-200">
                {languageLabel}
              </span>
            </div>
          </header>

          <div
            className={`mx-auto flex min-h-dvh w-full ${
              isSidebarOpen ? "max-w-450 lg:items-stretch" : "max-w-none"
            }`}
          >
            {isSidebarOpen ? (
              <div className="fixed inset-y-0 left-0 z-40 w-full translate-x-0 opacity-100 ps-sidebar-slide-in transition-all duration-300 ease-out sm:w-[24rem] md:w-72 lg:static lg:z-20 lg:w-80 lg:shrink-0 lg:animate-none">
                <div className="h-full p-3 sm:p-4 lg:p-4">
                  <Sidebar
                    session={session}
                    copyState={copyState}
                    onCopyLink={copyRoomLink}
                    users={users}
                    language={language}
                    onLanguageChange={handleLanguageChange}
                    messages={messages.map((message) => ({
                      ...message,
                      formattedTime: formatMessageTime(message.time),
                    }))}
                    chatInput={chatInput}
                    onChatInputChange={setChatInput}
                    onSendMessage={handleSendMessage}
                    chatScrollRef={chatScrollRef}
                    isConnected={isConnected}
                    connectedCount={connectedCount}
                    typingUsers={typingUsers}
                    onExport={handleExportCode}
                    isUsersLoading={showUsersSkeleton}
                    isMessagesLoading={showMessagesSkeleton}
                  />
                </div>
              </div>
            ) : null}

            <div
              className={`flex min-w-0 flex-1 flex-col ${
                isSidebarOpen
                  ? "p-3 pt-18 sm:p-4 sm:pt-20 lg:p-4 lg:pt-4"
                  : "p-0 pt-13 sm:pt-14 lg:pt-0"
              }`}
            >
              <Editor
                yText={realtime.yText}
                provider={realtime.provider}
                language={language}
                room={session.room}
                username={session.username}
                isSidebarOpen={isSidebarOpen}
                isFocusMode={!isSidebarOpen}
                onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
                onExport={handleExportCode}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <LandingPage
        onScrollToSection={scrollToSection}
        onStartRoom={startRoom}
        onOpenJoinModal={openJoinModal}
        year={new Date().getFullYear()}
      />
      <JoinModal
        isOpen={isJoinModalOpen}
        formSession={formSession}
        setFormSession={setFormSession}
        joinError={joinError}
        clearJoinError={() => setJoinError("")}
        isCheckingUsername={isCheckingUsername}
        onClose={() => setIsJoinModalOpen(false)}
        onSubmit={joinSession}
      />
    </>
  );
}

export default App;

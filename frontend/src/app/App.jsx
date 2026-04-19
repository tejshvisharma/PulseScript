import { useEffect, useMemo, useRef, useState } from "react";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";
import Editor from "../components/Editor";
import Sidebar from "../components/Sidebar";
import LandingPage from "../components/Landing/LandingPage";
import JoinModal from "../components/Landing/JoinModal";
import {
  formatMessageTime,
  getLanguageExtension,
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

  useEffect(() => {
    if (sessionReady) {
      setIsJoinModalOpen(false);
    }
  }, [sessionReady]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const media = window.matchMedia("(min-width: 768px)");
    const syncSidebarByViewport = () => {
      setIsSidebarOpen(media.matches);
    };

    syncSidebarByViewport();
    media.addEventListener("change", syncSidebarByViewport);

    return () => {
      media.removeEventListener("change", syncSidebarByViewport);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const isMobile = !window.matchMedia("(min-width: 768px)").matches;
    const previousOverflow = document.body.style.overflow;

    if (isMobile && isSidebarOpen && sessionReady) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
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
    const provider = new SocketIOProvider(
      "ws://localhost:3001",
      session.room,
      doc,
      {
        autoConnect: true,
        auth: {
          username: session.username,
          clientId,
        },
      },
    );

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

    const handleProviderConnectError = (error) => {
      const message = String(error?.message || "").toLowerCase();
      if (!message.includes("username") || !message.includes("taken")) {
        return;
      }

      setJoinError("Username already exists in this room. Choose a different name.");
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
      });
      nextUsers.sort((a, b) => a.name.localeCompare(b.name));
      setUsers(nextUsers);
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
      setMessages([]);
    };
  }, [clientId, session.room, session.username, sessionReady]);

  useEffect(() => {
    if (!chatScrollRef.current) {
      return;
    }
    chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
  }, [messages]);

  const isConnected = realtime.provider?.socket?.connected ?? false;

  const checkUsernameAvailability = (room, username) =>
    new Promise((resolve) => {
      const probeDoc = new Y.Doc();
      const probeProvider = new SocketIOProvider(
        "ws://localhost:3001",
        room,
        probeDoc,
        {
          autoConnect: true,
          auth: {
            username,
            clientId,
          },
        },
      );
      let settled = false;

      const cleanup = (result) => {
        if (settled) {
          return;
        }
        settled = true;
        window.clearTimeout(timeoutId);
        probeProvider.socket.off("connect", onConnect);
        probeProvider.socket.off("connect_error", onConnectError);
        probeProvider.destroy();
        probeDoc.destroy();
        resolve(result);
      };

      const onConnect = () => {
        cleanup({ available: true, reason: "ok" });
      };

      const onConnectError = (error) => {
        const message = String(error?.message || "").toLowerCase();
        cleanup({
          available: false,
          reason:
            message.includes("username") && message.includes("taken")
              ? "taken"
              : "connection",
        });
      };

      const timeoutId = window.setTimeout(() => {
        cleanup({ available: false, reason: "timeout" });
      }, 2000);

      probeProvider.socket.on("connect", onConnect);
      probeProvider.socket.on("connect_error", onConnectError);
    });

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
        setJoinError("Username already exists in this room. Choose a different name.");
      } else {
        setJoinError("Could not verify room users right now. Please try again.");
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
    link.download = `quickpair-${session.room}.${extension}`;
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

  if (sessionReady) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-neutral-950 text-neutral-100">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />
        </div>

        {isSidebarOpen ? (
          <button
            type="button"
            aria-label="Close sidebar"
            className="fixed inset-0 z-20 bg-black/45 backdrop-blur-[1px] md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        ) : null}

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-400 flex-col gap-3 p-3 sm:p-4 md:flex-row md:p-5 md:gap-4">
          <div
            className={`fixed inset-y-3 left-3 z-30 w-[min(24rem,calc(100vw-1.5rem))] transition-all duration-300 md:static md:inset-auto md:left-auto md:z-10 md:w-96 md:overflow-hidden ${
              isSidebarOpen
                ? "translate-x-0 opacity-100 md:pointer-events-auto"
                : "-translate-x-[105%] opacity-0 pointer-events-none md:translate-x-0 md:opacity-100"
            }`}
          >
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
            />
          </div>

          <Editor
            yText={realtime.yText}
            provider={realtime.provider}
            language={language}
            room={session.room}
            username={session.username}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
            onExport={handleExportCode}
          />
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

import { useEffect, useMemo, useRef, useState } from "react";
import { FULL_LANGUAGES, getLanguageLabel } from "../utils/languages";

function Sidebar({
  session,
  copyState,
  onCopyLink,
  users,
  language,
  onLanguageChange,
  messages,
  chatInput,
  onChatInputChange,
  onSendMessage,
  chatScrollRef,
  isConnected,
  connectedCount,
  typingUsers = [],
  onExport,
  isUsersLoading = false,
  isMessagesLoading = false,
}) {
  const [languageQuery, setLanguageQuery] = useState(() =>
    getLanguageLabel(language),
  );
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [highlightedLanguageIndex, setHighlightedLanguageIndex] = useState(0);
  const languageComboboxRef = useRef(null);
  const languageListRef = useRef(null);
  const LANGUAGE_PAGE_STEP = 6;

  const selectedLanguageLabel = useMemo(
    () => getLanguageLabel(language),
    [language],
  );

  const filteredLanguages = useMemo(() => {
    const query = languageQuery.trim().toLowerCase();
    if (!query) {
      return FULL_LANGUAGES;
    }

    return FULL_LANGUAGES.filter(
      (option) =>
        option.label.toLowerCase().includes(query) ||
        option.value.toLowerCase().includes(query),
    );
  }, [languageQuery]);

  const typingStatus = useMemo(() => {
    if (!typingUsers.length) {
      return "";
    }
    if (typingUsers.length === 1) {
      return `${typingUsers[0]} is typing...`;
    }
    if (typingUsers.length === 2) {
      return `${typingUsers[0]} and ${typingUsers[1]} are typing...`;
    }
    return `${typingUsers[0]}, ${typingUsers[1]} and ${typingUsers.length - 2} others are typing...`;
  }, [typingUsers]);

  useEffect(() => {
    setLanguageQuery(selectedLanguageLabel);
  }, [selectedLanguageLabel]);

  useEffect(() => {
    if (!filteredLanguages.length) {
      setHighlightedLanguageIndex(0);
      return;
    }

    const selectedIndex = filteredLanguages.findIndex(
      (option) => option.value === language,
    );
    setHighlightedLanguageIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [filteredLanguages, language, isLanguageMenuOpen]);

  useEffect(() => {
    if (
      !isLanguageMenuOpen ||
      !languageListRef.current ||
      !filteredLanguages.length
    ) {
      return;
    }

    const optionId = `language-option-${filteredLanguages[highlightedLanguageIndex]?.value}`;
    const optionNode = document.getElementById(optionId);
    optionNode?.scrollIntoView({ block: "nearest" });
  }, [filteredLanguages, highlightedLanguageIndex, isLanguageMenuOpen]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!languageComboboxRef.current?.contains(event.target)) {
        setIsLanguageMenuOpen(false);
        setLanguageQuery(selectedLanguageLabel);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [selectedLanguageLabel]);

  const handleLanguagePick = (nextLanguage) => {
    onLanguageChange(nextLanguage);
    setLanguageQuery(getLanguageLabel(nextLanguage));
    setIsLanguageMenuOpen(false);
  };

  const openLanguageMenuIfNeeded = () => {
    if (!isLanguageMenuOpen) {
      setIsLanguageMenuOpen(true);
      return true;
    }
    return false;
  };

  const activeOption = filteredLanguages[highlightedLanguageIndex];
  const activeDescendant =
    isLanguageMenuOpen && activeOption
      ? `language-option-${activeOption.value}`
      : undefined;

  return (
    <aside className="h-full w-full touch-manipulation">
      <div className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto rounded-2xl border border-slate-700/80 bg-slate-900/95 p-4 shadow-xl ring-1 ring-white/5 backdrop-blur-md">
        <section className="rounded-xl border border-slate-700 bg-linear-to-br from-slate-950 to-slate-900 p-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h1 className="text-lg font-semibold tracking-tight text-slate-100">
              PulseScript
            </h1>
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${
                isConnected
                  ? "bg-emerald-500/20 text-emerald-200"
                  : "bg-amber-500/20 text-amber-200"
              }`}
            >
              {isConnected ? "Connected" : "Connecting"}
            </span>
          </div>
          <p className="text-sm text-slate-300">
            {session.username} in room {session.room}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onCopyLink}
              className="rounded-lg border border-indigo-500/50 bg-indigo-500/10 px-3 py-2 text-sm text-indigo-100 transition hover:bg-indigo-500/20"
            >
              {copyState}
            </button>
            <button
              type="button"
              onClick={onExport}
              className="rounded-lg bg-indigo-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-indigo-400"
            >
              Export
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-slate-700 bg-slate-950/90 p-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <label
              className="block text-sm font-medium text-slate-200"
              htmlFor="language-search"
            >
              Language
            </label>
            <span className="rounded-full border border-indigo-500/40 bg-indigo-500/10 px-2 py-1 text-xs text-indigo-200">
              {selectedLanguageLabel} ●
            </span>
          </div>

          <div ref={languageComboboxRef} className="relative">
            <input
              id="language-search"
              type="text"
              role="combobox"
              aria-expanded={isLanguageMenuOpen}
              aria-controls="language-options"
              aria-autocomplete="list"
              aria-activedescendant={activeDescendant}
              value={languageQuery}
              onFocus={() => setIsLanguageMenuOpen(true)}
              onChange={(event) => {
                setLanguageQuery(event.target.value);
                setIsLanguageMenuOpen(true);
                setHighlightedLanguageIndex(0);
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setIsLanguageMenuOpen(false);
                  setLanguageQuery(selectedLanguageLabel);
                }

                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  if (openLanguageMenuIfNeeded()) {
                    return;
                  }

                  if (!filteredLanguages.length) {
                    return;
                  }

                  setHighlightedLanguageIndex((prev) =>
                    prev >= filteredLanguages.length - 1 ? 0 : prev + 1,
                  );
                }

                if (event.key === "ArrowUp") {
                  event.preventDefault();
                  if (openLanguageMenuIfNeeded()) {
                    return;
                  }

                  if (!filteredLanguages.length) {
                    return;
                  }

                  setHighlightedLanguageIndex((prev) =>
                    prev <= 0 ? filteredLanguages.length - 1 : prev - 1,
                  );
                }

                if (event.key === "Home") {
                  event.preventDefault();
                  openLanguageMenuIfNeeded();
                  if (!filteredLanguages.length) {
                    return;
                  }
                  setHighlightedLanguageIndex(0);
                }

                if (event.key === "End") {
                  event.preventDefault();
                  openLanguageMenuIfNeeded();
                  if (!filteredLanguages.length) {
                    return;
                  }
                  setHighlightedLanguageIndex(filteredLanguages.length - 1);
                }

                if (event.key === "PageDown") {
                  event.preventDefault();
                  openLanguageMenuIfNeeded();
                  if (!filteredLanguages.length) {
                    return;
                  }
                  setHighlightedLanguageIndex((prev) =>
                    Math.min(
                      prev + LANGUAGE_PAGE_STEP,
                      filteredLanguages.length - 1,
                    ),
                  );
                }

                if (event.key === "PageUp") {
                  event.preventDefault();
                  openLanguageMenuIfNeeded();
                  if (!filteredLanguages.length) {
                    return;
                  }
                  setHighlightedLanguageIndex((prev) =>
                    Math.max(prev - LANGUAGE_PAGE_STEP, 0),
                  );
                }

                if (event.key === "Enter" && filteredLanguages.length > 0) {
                  event.preventDefault();
                  const pickedLanguage =
                    filteredLanguages[highlightedLanguageIndex] ||
                    filteredLanguages[0];
                  handleLanguagePick(pickedLanguage.value);
                }
              }}
              placeholder="Search language"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />

            {isLanguageMenuOpen ? (
              <ul
                id="language-options"
                role="listbox"
                ref={languageListRef}
                className="absolute z-20 mt-2 max-h-56 w-full overflow-y-auto rounded-lg border border-slate-700 bg-slate-900 p-1 shadow-xl"
              >
                {filteredLanguages.length === 0 ? (
                  <li className="px-2.5 py-2 text-sm text-slate-400">
                    No language match found.
                  </li>
                ) : (
                  filteredLanguages.map((option, index) => (
                    <li key={option.value}>
                      <button
                        id={`language-option-${option.value}`}
                        type="button"
                        role="option"
                        aria-selected={index === highlightedLanguageIndex}
                        onMouseDown={(event) => event.preventDefault()}
                        onMouseEnter={() => setHighlightedLanguageIndex(index)}
                        onClick={() => handleLanguagePick(option.value)}
                        className={`flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-sm transition ${
                          index === highlightedLanguageIndex
                            ? "bg-indigo-500/20 text-indigo-200"
                            : "text-slate-200 hover:bg-slate-800"
                        }`}
                      >
                        <span>{option.label}</span>
                        <span className="text-xs text-slate-400">
                          {option.value}
                        </span>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            ) : null}
          </div>
        </section>

        <section className="rounded-xl border border-slate-700 bg-slate-950/90 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-100">Live Users</h2>
            <span className="text-xs text-slate-400">{connectedCount}</span>
          </div>
          <ul className="max-h-44 space-y-2 overflow-y-auto pr-1 md:max-h-56">
            {isUsersLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <li
                  key={`users-skeleton-${index}`}
                  className="h-9 animate-pulse rounded-lg border border-slate-700 bg-slate-800/70"
                />
              ))
            ) : users.length === 0 ? (
              <li className="rounded-lg border border-dashed border-slate-700 bg-slate-900/60 px-3 py-2 text-xs text-slate-400">
                Waiting for collaborators...
              </li>
            ) : (
              users.map((user) => (
                <li
                  key={user.id}
                  className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: user.color }}
                    />
                    <span className="text-sm text-slate-200">{user.name}</span>
                  </div>
                  {user.isSelf ? (
                    <span className="text-xs text-indigo-300">You</span>
                  ) : null}
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="flex min-h-0 flex-1 flex-col rounded-xl border border-slate-700 bg-slate-950/90 p-4">
          <h2 className="mb-2 text-sm font-semibold text-slate-100">
            Room Chat
          </h2>
          {typingStatus ? (
            <p className="mb-2 text-xs text-indigo-200" aria-live="polite">
              {typingStatus}
            </p>
          ) : null}
          <div
            ref={chatScrollRef}
            aria-live="polite"
            className="mb-3 min-h-28 max-h-72 flex-1 space-y-2 overflow-y-auto rounded-lg border border-slate-700 bg-slate-900 p-2.5 md:max-h-[38vh]"
          >
            {isMessagesLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`chat-skeleton-${index}`}
                  className="h-12 animate-pulse rounded-lg border border-slate-700 bg-slate-800/70"
                />
              ))
            ) : messages.length === 0 ? (
              <p className="rounded-lg border border-dashed border-slate-700 bg-slate-900/60 px-3 py-2 text-xs text-slate-500">
                No messages yet.
              </p>
            ) : (
              messages.map((message, index) => (
                <div
                  key={`${message.user}-${message.time}-${index}`}
                  className={`rounded-lg px-2.5 py-1.5 ${
                    message.user === session.username
                      ? "ml-5 border border-indigo-500/30 bg-indigo-500/10"
                      : "mr-5 bg-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{message.user}</span>
                    <span>{message.formattedTime}</span>
                  </div>
                  <p className="text-sm text-slate-100">{message.text}</p>
                </div>
              ))
            )}
          </div>

          <form onSubmit={onSendMessage} className="flex w-full min-w-0 gap-2">
            <input
              value={chatInput}
              onChange={(event) => onChatInputChange(event.target.value)}
              placeholder="Type message"
              className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="shrink-0 rounded-lg bg-indigo-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            >
              Send
            </button>
          </form>
        </section>
      </div>
    </aside>
  );
}

export default Sidebar;

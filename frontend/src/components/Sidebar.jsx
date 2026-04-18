import { LANGUAGE_OPTIONS } from "../utils/helpers";

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
}) {
  return (
    <aside className="h-full w-full">
      <div className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto rounded-2xl border border-neutral-800/80 bg-neutral-900/70 p-4 shadow-2xl ring-1 ring-white/5 backdrop-blur">
        <section className="rounded-xl border border-neutral-800 bg-linear-to-br from-neutral-950 to-neutral-900 p-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h1 className="text-lg font-semibold tracking-tight text-white">
              QuickPair
            </h1>
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${
                isConnected
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-amber-500/20 text-amber-300"
              }`}
            >
              {isConnected ? "Connected" : "Connecting"}
            </span>
          </div>
          <p className="text-sm text-neutral-300">
            {session.username} in room {session.room}
          </p>
          <button
            type="button"
            onClick={onCopyLink}
            className="mt-3 w-full rounded-lg border border-cyan-500/50 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100 transition hover:bg-cyan-500/20"
          >
            {copyState}
          </button>
        </section>

        <section className="rounded-xl border border-neutral-800 bg-neutral-950/90 p-4">
          <label
            className="mb-2 block text-sm font-medium text-neutral-200"
            htmlFor="language-select"
          >
            Language
          </label>
          <select
            id="language-select"
            value={language}
            onChange={(event) => onLanguageChange(event.target.value)}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-neutral-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          >
            {LANGUAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </section>

        <section className="rounded-xl border border-neutral-800 bg-neutral-950/90 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-100">
              Live Users
            </h2>
            <span className="text-xs text-neutral-400">{connectedCount}</span>
          </div>
          <ul className="max-h-44 space-y-2 overflow-y-auto pr-1 md:max-h-56">
            {users.length === 0 ? (
              <li className="rounded-lg border border-dashed border-neutral-800 bg-neutral-900/60 px-3 py-2 text-xs text-neutral-400">
                Waiting for collaborators...
              </li>
            ) : (
              users.map((user) => (
                <li
                  key={user.id}
                  className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: user.color }}
                    />
                    <span className="text-sm text-neutral-200">
                      {user.name}
                    </span>
                  </div>
                  {user.isSelf ? (
                    <span className="text-xs text-cyan-300">You</span>
                  ) : null}
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="flex min-h-0 flex-1 flex-col rounded-xl border border-neutral-800 bg-neutral-950/90 p-4">
          <h2 className="mb-2 text-sm font-semibold text-neutral-100">
            Room Chat
          </h2>
          <div
            ref={chatScrollRef}
            aria-live="polite"
            className="mb-3 min-h-28 max-h-72 flex-1 space-y-2 overflow-y-auto rounded-lg border border-neutral-800 bg-neutral-900 p-2.5 md:max-h-[38vh]"
          >
            {messages.length === 0 ? (
              <p className="rounded-lg border border-dashed border-neutral-800 bg-neutral-900/60 px-3 py-2 text-xs text-neutral-500">
                No messages yet.
              </p>
            ) : (
              messages.map((message, index) => (
                <div
                  key={`${message.user}-${message.time}-${index}`}
                  className={`rounded-lg px-2.5 py-1.5 ${
                    message.user === session.username
                      ? "ml-5 border border-cyan-500/30 bg-cyan-500/10"
                      : "mr-5 bg-neutral-800"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span>{message.user}</span>
                    <span>{message.formattedTime}</span>
                  </div>
                  <p className="text-sm text-neutral-100">{message.text}</p>
                </div>
              ))
            )}
          </div>

          <form onSubmit={onSendMessage} className="flex gap-2">
            <input
              value={chatInput}
              onChange={(event) => onChatInputChange(event.target.value)}
              placeholder="Type message"
              className="flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            />
            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-400"
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

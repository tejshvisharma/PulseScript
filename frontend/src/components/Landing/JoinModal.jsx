function JoinModal({
  isOpen,
  formSession,
  setFormSession,
  joinError,
  clearJoinError,
  isCheckingUsername,
  onClose,
  onSubmit,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-5 rounded-2xl border border-violet-400/25 bg-[#1f1f26]/95 p-7 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              Join QuickPair
            </h2>
            <p className="mt-1 text-sm text-[#ccc3d8]">
              Enter username and room to begin live collaboration.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded-md border border-white/20 px-2 py-1 text-xs text-[#ccc3d8] hover:text-white"
          >
            Close
          </button>
        </div>

        <p className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-xs text-cyan-200">
          Username must be unique inside the room.
        </p>

        <div className="space-y-2">
          <label htmlFor="username" className="text-sm text-[#e4e1ec]">
            Username
          </label>
          <input
            id="username"
            value={formSession.username}
            onChange={(event) =>
              setFormSession((prev) => ({
                ...prev,
                username: event.target.value,
              }))
            }
            onInput={clearJoinError}
            disabled={isCheckingUsername}
            className="w-full rounded-lg border border-[#4a4455] bg-[#0e0e15] px-3 py-2.5 text-sm text-white outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            placeholder="your-name"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="room" className="text-sm text-[#e4e1ec]">
            Room
          </label>
          <input
            id="room"
            value={formSession.room}
            onChange={(event) =>
              setFormSession((prev) => ({
                ...prev,
                room: event.target.value,
              }))
            }
            onInput={clearJoinError}
            disabled={isCheckingUsername}
            className="w-full rounded-lg border border-[#4a4455] bg-[#0e0e15] px-3 py-2.5 text-sm text-white outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            placeholder="frontend-sprint"
          />
        </div>

        {joinError ? (
          <p className="rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
            {joinError}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isCheckingUsername}
          className="w-full rounded-full bg-violet-600 px-4 py-2.5 font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:bg-[#4a4455] disabled:text-[#b6afc5]"
        >
          {isCheckingUsername ? "Checking username..." : "Enter Room"}
        </button>
      </form>
    </div>
  );
}

export default JoinModal;

export { LANGUAGE_OPTIONS, getLanguageExtension } from "./languages";

const USER_COLORS = [
  "#22d3ee",
  "#f97316",
  "#84cc16",
  "#e879f9",
  "#f43f5e",
  "#60a5fa",
  "#facc15",
  "#34d399",
];

const CLIENT_ID_STORAGE_KEY = "quickpair_client_id";

const createClientId = () => {
  if (typeof window !== "undefined" && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return `qp-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export function parseSessionFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return {
    username: (params.get("username") || "").trim(),
    room: (params.get("room") || "").trim(),
  };
}

export function upsertSessionInUrl(username, room) {
  const params = new URLSearchParams(window.location.search);
  if (username) {
    params.set("username", username);
  } else {
    params.delete("username");
  }

  if (room) {
    params.set("room", room);
  } else {
    params.delete("room");
  }

  const query = params.toString();
  const nextUrl = query
    ? `${window.location.pathname}?${query}`
    : window.location.pathname;
  window.history.replaceState({}, "", nextUrl);
}

export function getOrCreateTabClientId() {
  if (typeof window === "undefined") {
    return "server";
  }

  try {
    const existing = window.sessionStorage.getItem(CLIENT_ID_STORAGE_KEY);
    if (existing) {
      return existing;
    }

    const nextId = createClientId();
    window.sessionStorage.setItem(CLIENT_ID_STORAGE_KEY, nextId);
    return nextId;
  } catch {
    return createClientId();
  }
}

export function getUserColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  return USER_COLORS[Math.abs(hash) % USER_COLORS.length];
}

export function formatMessageTime(timeValue) {
  const date = new Date(timeValue);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

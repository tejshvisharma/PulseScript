export const LANGUAGE_OPTIONS = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
  { value: "java", label: "Java" },
];

const LANGUAGE_TO_EXTENSION = {
  javascript: "js",
  python: "py",
  c: "c",
  cpp: "cpp",
  java: "java",
};

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

export function getLanguageExtension(language) {
  return LANGUAGE_TO_EXTENSION[language] || "txt";
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

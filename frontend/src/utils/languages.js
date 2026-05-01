export const FULL_LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
  { value: "cs", label: "C#" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "scss", label: "SCSS" },
  { value: "json", label: "JSON" },
  { value: "yaml", label: "YAML" },
  { value: "sql", label: "SQL" },
  { value: "shell", label: "Bash" },
  { value: "markdown", label: "Markdown" },
];

export const LANGUAGE_EXTENSION_MAP = {
  javascript: "js",
  typescript: "ts",
  python: "py",
  java: "java",
  c: "c",
  cpp: "cpp",
  cs: "cs",
  php: "php",
  ruby: "rb",
  go: "go",
  rust: "rs",
  swift: "swift",
  kotlin: "kt",
  html: "html",
  css: "css",
  scss: "scss",
  json: "json",
  yaml: "yml",
  sql: "sql",
  shell: "sh",
  markdown: "md",
};

const LANGUAGE_LABEL_MAP = FULL_LANGUAGES.reduce((acc, option) => {
  acc[option.value] = option.label;
  return acc;
}, {});

export const LANGUAGE_OPTIONS = FULL_LANGUAGES;

export function getLanguageExtension(language) {
  return LANGUAGE_EXTENSION_MAP[language] || "txt";
}

export function getLanguageLabel(language) {
  return LANGUAGE_LABEL_MAP[language] || "Unknown";
}

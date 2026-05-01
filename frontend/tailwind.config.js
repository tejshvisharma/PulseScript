/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        cal: ["Inter", "Space Grotesk", "ui-sans-serif", "system-ui"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        brand: {
          500: "#6366f1",
          600: "#4f46e5",
        },
      },
      boxShadow: {
        stitchLight: "0 1px 2px rgba(15, 23, 42, 0.15)",
        stitchMedium: "0 12px 30px rgba(15, 23, 42, 0.32)",
      },
      borderRadius: {
        "2xl": "1rem",
      },
    },
    screens: {
      sm: "480px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
};

import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0078D4",
        success: "#28A745",
        warning: "#FFC107",
        danger: "#DC3545",
        orange: "#FD7E14",
        ai: "#6F42C1",
        inactive: "#6C757D",
        background: "#F5F7FA",
        text: "#1F2937",
        navy: "#071F3A"
      },
      boxShadow: {
        soft: "0 8px 24px rgba(7, 31, 58, 0.07)",
        lift: "0 14px 34px rgba(7, 31, 58, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;

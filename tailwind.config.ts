import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FAF7F2",
        ink: "#22201C",
        stone: "#8B8578",
        forest: {
          DEFAULT: "#1F4B3B",
          light: "#2C6B52",
          dark: "#153529",
        },
        rust: {
          DEFAULT: "#A8452F",
          light: "#C4593F",
        },
        gold: {
          DEFAULT: "#C9942C",
          light: "#E0B45C",
        },
        sky: {
          DEFAULT: "#2E6FA8",
          light: "#4C8DC4",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        card: "14px",
      },
    },
  },
  plugins: [],
};
export default config;

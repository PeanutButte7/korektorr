import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config = {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    color: {
      white: colors.white,
      gray: colors.gray,
      blue: colors.blue,
      emerald: colors.emerald,
    },
    extend: {
      fontFamily: {
        sans: ["--font-grotesk", "sans-serif"],
        paragraph: ["--font-inter", "sans-serif"],
      },
      colors: {
        border: colors.gray[200],
        background: colors.gray[50],
        foreground: colors.gray[900],
        primary: {
          DEFAULT: colors.blue[600],
          foreground: colors.blue[50],
        },
        destructive: {
          DEFAULT: colors.pink[600],
          foreground: colors.pink[50],
        },
        success: {
          DEFAULT: colors.emerald[600],
          foreground: colors.emerald[50],
        },
        muted: {
          DEFAULT: colors.gray[100],
          foreground: colors.gray[500],
        },
        card: {
          DEFAULT: colors.white,
          foreground: colors.gray[900],
          hover: colors.gray[100],
        },
        main: "#FAFAF9",
        error: {
          spell: colors.pink[500],
          punctuation: colors.amber[500],
        },
      },
      boxShadow: {
        "inner-soft": "inset 0px -1px 4px 0px rgba(0,0,0,0.05)",
        pop: "inset 0px -1px 4px 0px rgba(0,0,0,0.05), 0px 1px 2px 0px rgba(0,0,0,0.05), 0px 4px 4px -2px rgba(0,0,0,0.05)",
      },
      backgroundSize: {
        "size-200": "200% 200%",
      },
      backgroundPosition: {
        "pos-0": "0% 0%",
        "pos-100": "100% 100%",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;

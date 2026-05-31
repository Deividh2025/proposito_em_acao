import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        purpose: {
          50: "#f2f8f4",
          100: "#dcece2",
          300: "#95c7aa",
          500: "#2f7d4b",
          700: "#17633f",
          900: "#103623"
        },
        action: {
          50: "#eef8fb",
          100: "#d5edf5",
          500: "#256f8f",
          700: "#174f69",
          900: "#0f3141"
        },
        warmth: {
          50: "#fff8ea",
          100: "#f8e7bd",
          500: "#b98022",
          700: "#875a16",
          900: "#4c320c"
        },
        gentleDanger: {
          50: "#fff2f0",
          100: "#f5d7d3",
          500: "#b94a48",
          700: "#8f3433",
          900: "#52201f"
        },
        ink: {
          50: "#f7f8f5",
          100: "#e8eee9",
          300: "#c9d4cd",
          500: "#657168",
          700: "#38443d",
          900: "#17211b"
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Arial", "Helvetica", "sans-serif"]
      },
      boxShadow: {
        soft: "0 16px 40px rgb(23 33 27 / 0.08)",
        focus: "0 0 0 3px rgb(37 111 143 / 0.32)"
      },
      borderRadius: {
        control: "0.375rem",
        card: "0.5rem",
        panel: "0.75rem"
      }
    }
  },
  plugins: []
};

export default config;

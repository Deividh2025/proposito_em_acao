export { designModes } from "./modes";

export const designTokens = {
  colors: {
    background: "#f7f8f5",
    surface: "#ffffff",
    surfaceSoft: "#eef3ee",
    ink: {
      50: "#f7f8f5",
      100: "#e8eee9",
      300: "#c9d4cd",
      500: "#657168",
      700: "#38443d",
      900: "#17211b"
    },
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
    danger: {
      50: "#fff2f0",
      100: "#f5d7d3",
      500: "#b94a48",
      700: "#8f3433",
      900: "#52201f"
    }
  },
  typography: {
    fontSans: "var(--font-sans)",
    headingWeight: 700,
    bodyWeight: 400,
    labelWeight: 650
  },
  space: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
    "2xl": "2rem",
    "3xl": "3rem"
  },
  radii: {
    control: "0.375rem",
    card: "0.5rem",
    panel: "0.75rem"
  },
  shadows: {
    soft: "0 16px 40px rgb(23 33 27 / 0.08)",
    focus: "0 0 0 3px rgb(25 118 163 / 0.32)"
  },
  motion: {
    duration: {
      fast: "120ms",
      base: "180ms",
      calm: "240ms"
    },
    easing: "cubic-bezier(0.2, 0, 0, 1)"
  }
} as const;

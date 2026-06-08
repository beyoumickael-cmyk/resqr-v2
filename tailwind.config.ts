import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--rq-bg)",
        "bg-deep": "var(--rq-bg-deep)",
        surface: "var(--rq-surface)",
        "surface-2": "var(--rq-surface-2)",
        border: "var(--rq-border)",
        "border-strong": "var(--rq-border-strong)",
        text: "var(--rq-text)",
        "text-muted": "var(--rq-text-muted)",
        "text-faint": "var(--rq-text-faint)",
        accent: "var(--rq-accent)",
        "accent-contrast": "var(--rq-accent-contrast)",
        teal: "var(--rq-teal)",
        success: "var(--rq-success)",
        warning: "var(--rq-warning)",
        critical: "var(--rq-critical)",
        "led-black": "var(--rq-led-black)",
        "led-green": "var(--rq-led-green)",
        "led-amber": "var(--rq-led-amber)",
        "led-red": "var(--rq-led-red)",
      },
      fontFamily: {
        ui: "var(--rq-font-ui)",
        mono: "var(--rq-font-mono)",
      },
      borderRadius: {
        sm: "var(--rq-radius-sm)",
        md: "var(--rq-radius-md)",
        lg: "var(--rq-radius-lg)",
        pill: "var(--rq-radius-pill)",
      },
      spacing: {
        "rq-1": "var(--rq-space-1)",
        "rq-2": "var(--rq-space-2)",
        "rq-3": "var(--rq-space-3)",
        "rq-4": "var(--rq-space-4)",
        control: "var(--rq-control-h)",
      },
      height: {
        control: "var(--rq-control-h)",
      },
      minHeight: {
        control: "var(--rq-control-h)",
      },
      boxShadow: {
        popup: "var(--rq-shadow-popup)",
      },
      zIndex: {
        popup: "2002",
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Nova paleta de cores
        cynthia: {
          "green-dark": "#1C4B3D", // Verde escuro - Logo principal, botões, títulos
          "yellow-mustard": "#F0B547", // Amarelo mostarda - Fundo, destaques, ícones
          cream: "#FCE9C9", // Creme/Bege claro - Fundo geral, áreas de leitura
          "orange-pumpkin": "#E17F2D", // Laranja abóbora - Realce (hover, detalhes)
          "green-leaf": "#4CAF50", // Verde folha - Elementos decorativos, ícones
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#1C4B3D",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "#F0B547",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        steam: {
          "0%": { transform: "translateY(0px) scale(1)", opacity: "0.7" },
          "50%": { transform: "translateY(-20px) scale(1.1)", opacity: "0.4" },
          "100%": { transform: "translateY(-40px) scale(1.2)", opacity: "0" },
        },
        "leaf-fall": {
          "0%": { transform: "translateY(-100px) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(100vh) rotate(360deg)", opacity: "0" },
        },
        bubble: {
          "0%": { transform: "translateY(0px) scale(0)", opacity: "0" },
          "50%": { transform: "translateY(-50px) scale(1)", opacity: "0.6" },
          "100%": { transform: "translateY(-100px) scale(0)", opacity: "0" },
        },
        "pulse-soft": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(28, 75, 61, 0.3)" },
          "50%": { boxShadow: "0 0 15px rgba(28, 75, 61, 0.5)" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "fade-in-up": {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 3s ease-in-out infinite",
        steam: "steam 2s ease-out infinite",
        "leaf-fall": "leaf-fall 8s linear infinite",
        bubble: "bubble 3s ease-out infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "slide-in-left": "slide-in-left 0.6s ease-out",
        "slide-in-right": "slide-in-right 0.6s ease-out",
        "fade-in-up": "fade-in-up 0.6s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config

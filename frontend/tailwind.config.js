/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Saudi Cultural Colors - Blue for Trust/Primary
        primary: {
          50: "#eff6ff",
          100: "#dbeafe", 
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#2563eb", // Saudi Blue for trust
          600: "#1d4ed8",
          700: "#1e40af",
          800: "#1e3a8a",
          900: "#172554",
          950: "#0f172a",
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        // Saudi Green for Success/Islamic Context
        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0", 
          300: "#86efac",
          400: "#4ade80",
          500: "#16a34a", // Saudi Green
          600: "#15803d",
          700: "#166534", 
          800: "#14532d",
          900: "#0f172a",
          950: "#052e16",
          DEFAULT: "#16a34a",
        },
        // Gold for Premium/Luxury
        gold: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15",
          500: "#eab308", // Saudi Gold
          600: "#ca8a04",
          700: "#a16207",
          800: "#854d0e",
          900: "#713f12",
          950: "#422006",
          DEFAULT: "#eab308",
        },
        warning: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15",
          500: "#eab308",
          600: "#ca8a04",
          700: "#a16207",
          800: "#854d0e",
          900: "#713f12",
          DEFAULT: "#eab308",
        },
        danger: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
          DEFAULT: "#ef4444",
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
        xl: "var(--radius-xl)",
      },
      fontFamily: {
        // Arabic-first typography with 20% larger font sizes
        sans: ["'Noto Sans Arabic'", "'IBM Plex Sans Arabic'", "Inter", "system-ui", "sans-serif"],
        "sans-en": ["Inter", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "'Courier New'", "monospace"],
        arabic: ["'Noto Sans Arabic'", "'IBM Plex Sans Arabic'", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Enhanced sizing for Arabic text (20% larger)
        xs: ["14.4px", { lineHeight: "20px" }], // was 12px
        sm: ["16.8px", { lineHeight: "24px" }], // was 14px  
        base: ["19.2px", { lineHeight: "28px" }], // was 16px
        lg: ["21.6px", { lineHeight: "32px" }], // was 18px
        xl: ["24px", { lineHeight: "36px" }], // was 20px
        "2xl": ["28.8px", { lineHeight: "40px" }], // was 24px
        "3xl": ["36px", { lineHeight: "44px" }],
        "4xl": ["43.2px", { lineHeight: "48px" }],
        // Standard English sizes
        "xs-en": ["12px", { lineHeight: "16px" }],
        "sm-en": ["14px", { lineHeight: "20px" }],
        "base-en": ["16px", { lineHeight: "24px" }],
        "lg-en": ["18px", { lineHeight: "28px" }],
        "xl-en": ["20px", { lineHeight: "32px" }],
        "2xl-en": ["24px", { lineHeight: "32px" }],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        // RTL-aware spacing
        "safe-left": "env(safe-area-inset-left)",
        "safe-right": "env(safe-area-inset-right)",
      },
      // Mobile-first breakpoints for Saudi market (99% mobile penetration)
      screens: {
        'xs': '375px',   // iPhone SE and similar
        'sm': '640px',   // Mobile landscape
        'md': '768px',   // Tablet portrait
        'lg': '1024px',  // Tablet landscape / Small desktop
        'xl': '1280px',  // Desktop
        '2xl': '1536px', // Large desktop
      },
      boxShadow: {
        soft: "0 2px 8px rgba(0, 0, 0, 0.06)",
        medium: "0 4px 12px rgba(0, 0, 0, 0.1)",
        deep: "0 8px 24px rgba(0, 0, 0, 0.15)",
        glow: "0 0 20px rgba(59, 130, 246, 0.3)",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
        "slide-in-rtl": "slideInRtl 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "shimmer": "shimmer 2s linear infinite",
        "pulse-soft": "pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-gentle": "bounceGentle 1s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideInRtl: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(-5%)" },
          "50%": { transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
}
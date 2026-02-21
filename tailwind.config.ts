import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config = {
    darkMode: "class",
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
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
            fontFamily: {
                sans: ['var(--font-outfit)', 'sans-serif'],
            },
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(150, 5%, 15%)", // Deep Volcanic Soil
                    foreground: "#F9F6F0",        // Raw Cotton
                    50: "#f2f7f4",
                    100: "#e6e8e6",
                    200: "#c5dbcddd",
                    300: "#9dbfae",
                    400: "#74a088",
                    500: "#5A7C65",
                    600: "#456350",
                    700: "#384f41",
                    800: "#2f4036",
                    900: "#1a1f1c",
                },
                secondary: {
                    DEFAULT: "hsl(40, 20%, 97%)", // Raw Cotton
                    foreground: "hsl(150, 5%, 15%)",
                    100: "#F9F6F0",
                    200: "#F0EAD6",
                },
                accent: {
                    DEFAULT: "hsl(140, 40%, 45%)", // Moss
                    foreground: "#ffffff",
                    clay: "hsl(20, 30%, 85%)",     // Clay
                },
                muted: {
                    DEFAULT: "#F3F4F6",
                    foreground: "#6B7280",
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
                'xl': '1rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
                '4xl': '2.5rem',
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
    plugins: [tailwindcssAnimate],
} satisfies Config;

export default config;

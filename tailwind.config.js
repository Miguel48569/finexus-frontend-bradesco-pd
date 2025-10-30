/** @type {import('tailwindcss').Config} */
import { fontFamily } from "tailwindcss/defaultTheme";
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Define 'sans' (a fonte padrão) para usar sua variável Geist Sans
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],

        // Define 'mono' (a fonte mono) para usar sua variável Geist Mono
        mono: ["var(--font-geist-mono)", ...fontFamily.mono],
      },
      colors: {
        violet: {
          50: "#f4ecff",
          100: "#d3bcf3",
          200: "#ae88e3",
          300: "#8a58d4",
          400: "#6b34c6",
          500: "#5520b0",
          600: "#461592",
          700: "#381075",
          800: "#2a0c58",
          900: "#1d083c",
        },
      },
      // O bloco 'keyframes' começa aqui
      keyframes: {
        slideInFromRight: {
          "0%": {
            transform: "translateX(50%)",
            opacity: "0", // Mudei para string para ser consistente
          },
          "100%": {
            transform: "translateX(0)",
            opacity: "1",
          },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      }, // <-- O bloco 'keyframes' DEVE fechar aqui

      // O bloco 'animation' começa aqui, como irmão de 'keyframes'
      animation: {
        slideInRight: "slideInFromRight 1s ease-out forwards",
        fadeIn: "fadeIn 0.8s ease-out forwards",
      },
    }, // <-- Fim do 'extend'
  },
  plugins: [],
};

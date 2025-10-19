/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
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
    },
  },
  plugins: [],
};

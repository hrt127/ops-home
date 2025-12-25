/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        cockpit: {
          bg: "#050814",
          card: "#0b1020",
          border: "#1c2333",
          accent: "#00f6b1",
          accentSoft: "#00f6b133"
        }
      }
    }
  },
  plugins: []
};

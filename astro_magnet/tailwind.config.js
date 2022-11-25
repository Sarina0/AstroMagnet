/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#9A48D0",
        secondary: "#63458A",
        onSecondary: "#FEE1FF",
        tertiary: "#B288C0"
      }
    },
  },
  plugins: [],
}

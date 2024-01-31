/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#F06225",
        background: "#F1F5F9",
        text: "#283841",
        muted: "#AEB8C5",
      },
      fontFamily: {
        sans: ["IBM Plex Sans", "sans-serif"],
      },
    },
    container: {
      center: true,
      padding: "2rem",
    },
  },
  plugins: [],
};

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
        blue: "#009BD6",
        green: "#00D95F",
        // orange: "#F06225",
        orangeLight: "#FFAA00",
      },
      fontFamily: {
        sans: ["Outfit", "sans-serif"],
      },
    },
    container: {
      center: true,
      padding: "2rem",
    },
  },
  plugins: [],
};

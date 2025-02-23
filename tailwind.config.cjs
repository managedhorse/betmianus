// tailwind.config.cjs
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        slackey: ["Slackey", "cursive"],
      },
      colors: {
        primary: "#ff6f91",   // vibrant pink
        secondary: "#ffbc42", // light orange
        darkText: "#333333",
      },
    },
  },
  plugins: [],
};

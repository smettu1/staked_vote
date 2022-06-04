module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary-color)",
        "primary-highlight": "var(--primary-highlight-color)",
        secondary: "var(--secondary-color)",
        "secondary-highlight": "var(--secondary-highlight-color)",
        highlight: "var(--highlight-color)",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

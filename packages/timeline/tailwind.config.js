/** @type {import("tailwindcss").Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontSize: {
        "5xs": "8px",
        "4xs": "9px",
        "3xs": "10px",
        "2xs": "11px"
      },
      containers: {
        "6xs": "2rem",
        "5xs": "4rem",
        "4xs": "8rem",
        "3xs": "12rem",
        "2xs": "16rem",
      }
    },
  },
  plugins: []
}
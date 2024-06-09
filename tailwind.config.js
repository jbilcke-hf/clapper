/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
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
      fontFamily: {
        salsa: ['var(--font-salsa)'],
        clock: ["var(--font-clock)"],
      },
      fontSize: {
        "7xs": "5px",
        "7xs": "6px",
        "6xs": "7px",
        "5xs": "8px",
        "4xs": "9px",
        "3xs": "10px",
        "2xs": "11px"
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },

        swing: {
          '0%,100%' : { transform: 'rotate(10deg)' },
          '50%' : { transform: 'rotate(-10deg)' },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-in-out",
        "accordion-up": "accordion-up 0.2s ease-in-out",
        'swing': 'swing 0.8s ease-in-out infinite'
      },
      screens: {
        'print': { 'raw': 'print' },
      }
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/container-queries"),
  ],
}
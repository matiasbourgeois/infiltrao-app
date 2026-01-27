/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7C3AED",
          light: "#DDD6FE",
          dark: "#5B21B6",
        },
        secondary: {
          DEFAULT: "#FBBF24",
          light: "#FEF3C7",
          dark: "#B45309",
        },
        accent: {
          DEFAULT: "#EC4899",
          light: "#FCE7F3",
        },
        background: "#FDFCFE",
        card: "rgba(255, 255, 255, 0.7)",
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
        '5xl': '40px',
      },
    },
  },
  plugins: [],
}

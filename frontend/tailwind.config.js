/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      xs: "475px",
      sm: "660px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    extend: {
      colors: {
        "light-white": "rgba(255,255,255,0.3)",
      },
      keyframes: {
        fadeOut: {
          "0%": { opacity: 100 },
          "50%": { opacity: 50 },
          "100%": { opacity: 0 },
        },
      },
      animation: {
        fadingOut: "fadeOut 2s",
      },
    },
  },
  variants: {},
};

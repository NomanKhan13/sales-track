const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'serif'],
        roboto: ['Roboto', 'serif'],
        bangers: ['Bangers', 'sreif'],
      },
      colors: {
        primary: colors.blue[500],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', display: "none" },
          '100%': { opacity: '1', display: "flex" },
        },
      },
      animation: {
        'spin-slow': 'spin 1.25s linear infinite',
        fadeIn: "fadeIn 0.5s ease-in-out"
      },
    },
  },
  plugins: [],
};

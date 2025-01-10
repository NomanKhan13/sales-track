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
        primary: colors.amber[500],
      },
      animation: {
        'spin-slow': 'spin 1.25s linear infinite',
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./includes/**/*.html",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'bookpeek-orange': '#FF9900',
        'bookpeek-blue': '#1E3A5F',
      },
    },
  },
  plugins: [],
}

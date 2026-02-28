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
        'authorkit-orange': '#FF9900',
        'authorkit-blue': '#1E3A5F',
      },
    },
  },
  plugins: [],
}

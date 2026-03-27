module.exports = {
  plugins: [
    require('postcss-import'),
    require('tailwindcss'),
    ...(process.env.NODE_ENV === 'production' ? [
      require('@fullhuman/postcss-purgecss').purgeCSSPlugin({
        content: [
          './*.html',
          './includes/**/*.html',
          './js/**/*.js'
        ],
        defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
        safelist: {
          standard: [/^bg-/, /^text-/, /^border-/, /^hover:/, /^focus:/],
          deep: [],
          greedy: []
        }
      }),
      require('cssnano')({
        preset: ['default', {
          discardComments: { removeAll: true },
          normalizeWhitespace: true,
          minifyFontValues: { removeQuotes: false },
          colormin: false // Preserve black/white values
        }]
      })
    ] : [])
  ]
}

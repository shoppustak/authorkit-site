/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./includes/**/*.html",
    "./js/**/*.js"
  ],
  theme: {
    // Override defaults completely for strict control
    colors: {
      // Primary palette (only black and white)
      'black': '#000000',
      'white': '#FFFFFF',
      'transparent': 'transparent',
      'current': 'currentColor',

      // Brand accents (use sparingly for CTAs)
      'brand': {
        'orange': '#FF9900',
        'blue': '#1E3A5F',
      },

      // Semantic colors (accessibility-compliant)
      'success': '#059669',
      'error': '#DC2626',
      'warning': '#D97706',
      'info': '#2563EB',
    },

    fontFamily: {
      'headline': ['Playfair Display', 'serif'],
      'body': ['Source Serif 4', 'serif'],
      'ui': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
    },

    fontSize: {
      // Desktop sizes with optimal line heights
      'display': ['4rem', { lineHeight: '1.1', fontWeight: '700' }],
      'h1': ['3rem', { lineHeight: '1.2', fontWeight: '700' }],
      'h2': ['2.25rem', { lineHeight: '1.3', fontWeight: '600' }],
      'h3': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
      'h4': ['1.25rem', { lineHeight: '1.4', fontWeight: '500' }],
      'body-lg': ['1.25rem', { lineHeight: '1.6' }],
      'body': ['1.125rem', { lineHeight: '1.7' }],
      'sm': ['1rem', { lineHeight: '1.5' }],      // 16px minimum (was 14px)
      'xs': ['0.875rem', { lineHeight: '1.4' }],  // 14px minimum (was 12px)
    },

    spacing: {
      '0': '0',
      '0.5': '0.25rem',  // 4px
      '1': '0.5rem',      // 8px
      '2': '1rem',        // 16px
      '3': '1.5rem',      // 24px
      '4': '2rem',        // 32px
      '5': '2.5rem',      // 40px
      '6': '3rem',        // 48px
      '8': '4rem',        // 64px
      '10': '5rem',       // 80px
      '12': '6rem',       // 96px
      '16': '8rem',       // 128px
      '20': '10rem',      // 160px
      '24': '12rem',      // 192px
    },

    // Disable all border radius (flat design)
    borderRadius: {
      'none': '0',
      'DEFAULT': '0',
      'sm': '0',
      'md': '0',
      'lg': '0',
      'xl': '0',
      '2xl': '0',
      '3xl': '0',
      'full': '0',
    },

    // Disable all shadows (flat design)
    boxShadow: {
      'none': 'none',
      'DEFAULT': 'none',
      'sm': 'none',
      'md': 'none',
      'lg': 'none',
      'xl': 'none',
      '2xl': 'none',
      'inner': 'none',
    },

    // No transitions (instant interactions)
    transitionDuration: {
      '0': '0ms',
      'DEFAULT': '0ms',
      '75': '0ms',
      '100': '0ms',
      '150': '0ms',
      '200': '0ms',
      '300': '0ms',
      '500': '0ms',
      '700': '0ms',
      '1000': '0ms',
    },

    extend: {
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },

      maxWidth: {
        'container': '80rem', // 1280px
      },

      minHeight: {
        'touch': '44px', // Touch target minimum
      },

      borderWidth: {
        '3': '3px',
      },

      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },

  // Disable animation utilities completely
  corePlugins: {
    animation: false,
    backdropBlur: false,
    backdropBrightness: false,
    backdropContrast: false,
    backdropGrayscale: false,
    backdropHueRotate: false,
    backdropInvert: false,
    backdropOpacity: false,
    backdropSaturate: false,
    backdropSepia: false,
    blur: false,
    brightness: false,
    contrast: false,
    dropShadow: false,
    grayscale: false,
    hueRotate: false,
    invert: false,
    saturate: false,
    sepia: false,
  },

  plugins: [],
}

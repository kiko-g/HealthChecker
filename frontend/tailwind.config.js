const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // or "media" or "class"
  theme: {
    extend: {
      colors: {
        dark: '#1a202c',
        white: '#ffffff',
        transparent: 'transparent',
        current: 'currentColor',
        gray: colors.gray,
        bluegray: colors.blueGray,
        coolgray: colors.coolGray,
        truegray: colors.trueGray,
        warmgray: colors.warmGray,
        red: colors.red,
        orange: colors.orange,
        amber: colors.amber,
        yellow: colors.yellow,
        lime: colors.lime,
        green: colors.green,
        emerald: colors.emerald,
        teal: colors.teal,
        cyan: colors.cyan,
        sky: colors.sky,
        blue: colors.blue,
        indigo: colors.indigo,
        violet: colors.violet,
        purple: colors.purple,
        fuchsia: colors.fuchsia,
        pink: colors.pink,
        rose: colors.rose,
      },
      fontSize: {
        xxs: '0.6rem',
      },
      width: {
        124: '32rem',
        half: '50wh',
        screen: '100vw',
      },
      minWidth: {
        0: '0',
        '1/5': '20%',
        '1/4': '25%',
        '2/5': '40%',
        '1/2': '50%',
        '3/5': '60%',
        '3/4': '75%',
        '4/5': '80%',
        full: '100%',
        half: '50vw',
        screen: '100vw',
      },
      maxWidth: {
        0: '0',
        '1/5': '20%',
        '1/4': '25%',
        '2/5': '40%',
        '1/2': '50%',
        '3/5': '60%',
        '3/4': '75%',
        '4/5': '80%',
        full: '100%',
        half: '50vw',
        screen: '100vw',
      },
      minHeight: {
        0: '0',
        '1/5': '20%',
        '1/4': '25%',
        '2/5': '40%',
        '1/2': '50%',
        '3/5': '60%',
        '3/4': '75%',
        '4/5': '80%',
        full: '100%',
        half: '50vh',
        screen: '100vh',
      },
      maxHeight: {
        0: '0',
        '1/5': '20%',
        '1/4': '25%',
        '2/5': '40%',
        '1/2': '50%',
        '3/5': '60%',
        '3/4': '75%',
        '4/5': '80%',
        full: '100%',
        half: '50vh',
        screen: '100vh',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '3rem',
        '6xl': '4rem',
      },
      fontFamily: {
        inter: ['Inter', ...defaultTheme.fontFamily.sans],
        plex: ['IBM Plex Sans', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-font-inter')({
      // default settings
      a: -0.0223,
      b: 0.185,
      c: -0.1745,
      baseFontSize: 16,
      importFontFace: true,
    }),
  ],
}

module.exports = {
  purge: [
    // './public/*.html',
    // './public/**/*.html',
    // './public/**/**/*.html',
    // './src/**/*.js',
    // './src/**/*.ts',
    // './src/**/*.svelte',
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        panel: {
          header: '#ddbf5f',
          text: '#d4af37',
          dark: '#aa8c2c'
        },
        gold: {
          light: '#ddbf5f',
          base: '#d4af37',
          dark: '#aa8c2c'
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
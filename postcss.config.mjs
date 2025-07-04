const config = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' ? { cssnano: { preset: 'default' } } : {})
  },
}

export default config
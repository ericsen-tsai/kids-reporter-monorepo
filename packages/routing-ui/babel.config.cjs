module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '18',
          browsers: ['> 1%', 'last 2 versions', 'not dead'],
        },
        modules: 'commonjs', // Build CommonJS modules
      },
    ],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
        development: process.env.NODE_ENV === 'development',
        pragma: undefined, // Use automatic runtime
        pragmaFrag: undefined, // Use automatic runtime
      },
    ],
    [
      '@babel/preset-typescript',
      {
        isTSX: true,
        allExtensions: true,
      },
    ],
  ],
  plugins: ['@babel/plugin-transform-runtime'],
}

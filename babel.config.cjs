/* global process */
const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  babelrcRoots: [',', 'packages/*'],
  presets: [
    [
      '@babel/env',
      {
        modules: 'auto',
        targets: {
          node: '20',
        },
      },
    ],
    [
      '@babel/preset-react',
      {
        development: !isProduction,
      },
    ],
    '@babel/preset-typescript',
  ],
}

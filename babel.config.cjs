/* global process */
const isProduction = process.env.NODE_ENV === 'production'

/** @type {import('@babel/core').TransformOptions} */
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
        runtime: 'automatic',
      },
    ],
    '@babel/preset-typescript',
  ],
}

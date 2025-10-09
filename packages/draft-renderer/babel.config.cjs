//see docs: https://babeljs.io/docs/config-files
//we use babel.config.cjs rather than .babelrc.js for our babel setting

const pkg = require('./package.json')
const pkgName = pkg.name
const pkgVersion = pkg.version

/**
 * @param {import('@babel/core').ConfigAPI} api
 * @returns {import('@babel/core').TransformOptions}
 */
module.exports = function (api) {
  api.cache.forever()
  const plugins = [
    [
      'file-loader',
      {
        name: '[hash].[ext]',
        extensions: ['png', 'jpg', 'jpeg', 'gif', 'svg'],
        outputPath: '/lib/public',
        publicPath: `https://unpkg.com/${pkgName}@${pkgVersion}/lib/public`,
        context: '/src',
        limit: 0,
      },
    ],
    [
      'inline-react-svg',
      {
        svgo: {
          plugins: [
            {
              name: 'removeAttrs',
              params: { attrs: '(data-name)' },
            },
            'cleanupIDs',
          ],
        },
      },
    ],
  ]
  return {
    presets: [
      [
        '@babel/env',
        {
          modules: 'auto',
          targets: {
            node: '14',
          },
        },
      ],
      [
        '@babel/preset-react',
        {
          development: process.env.NODE_ENV !== 'production',
          runtime: 'automatic',
        },
      ],
      '@babel/preset-typescript',
    ],
    plugins,
  }
}

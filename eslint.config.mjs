import baseConfig from './eslint.base.config.mjs'
import globals from 'globals'

export default [
  ...baseConfig,
  {
    files: ['packages/**/*.{js,ts}'],
    languageOptions: {
      globals: {
        ...globals.es2022,
        ...globals.node,
        process: 'readonly',
      },
    },
  },
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '.next/**',
      'coverage/**',
      '*.min.js',
      'packages/*/dist/**',
      'packages/*/build/**',
      'packages/*/.next/**',
      'packages/*/lib/**',
      'packages/*/lib-temp/**',
      '**/migrations/**',
      '**/public/**',
      '**/.keystone/**',
      '**/.git/**',
      '**/.env.local*',
    ],
  },
]

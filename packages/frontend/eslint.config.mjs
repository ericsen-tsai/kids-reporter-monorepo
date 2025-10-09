import baseConfig, {
  typescriptConfig,
  javascriptConfig,
  nodeConfig,
} from '../../eslint.base.config.mjs'

export default [
  ...baseConfig,
  // Override for frontend package - React/Next.js focused
  {
    ...typescriptConfig,
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      ...typescriptConfig.rules,
      // Frontend specific rules
      'no-html-link-for-pages': 'off',
    },
  },
  {
    ...javascriptConfig,
    files: ['src/**/*.{js,jsx}'],
    rules: {
      ...javascriptConfig.rules,
      // Frontend specific rules
      'no-html-link-for-pages': 'off',
    },
  },
  {
    ...nodeConfig,
    files: ['**/*.config.{js,mjs}', '**/environment-variables.ts'],
    rules: {
      ...nodeConfig.rules,
      'no-undef': 'error',
    },
  },
  {
    ignores: ['.next/**', 'node_modules/**', 'dist/**', 'build/**', 'out/**'],
  },
]

import baseConfig, { nodeConfig } from '../../eslint.base.config.mjs'

export default [
  ...baseConfig,
  // Override for API gateway package - Node.js focused
  {
    ...nodeConfig,
    files: ['src/**/*.{ts,js}'],
    rules: {
      ...nodeConfig.rules,
      // API gateway specific rules
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
]

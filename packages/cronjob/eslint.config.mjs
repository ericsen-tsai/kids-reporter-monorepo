import baseConfig, { nodeConfig } from '../../eslint.base.config.mjs'

export default [
  ...baseConfig,
  // Override for cronjob package - Node.js focused
  {
    ...nodeConfig,
    files: ['**/*.{ts,js}'],
    rules: {
      ...nodeConfig.rules,
      // Cronjob specific rules
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
]

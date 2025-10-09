import baseConfig, { nodeConfig } from '../../eslint.base.config.mjs'

export default [
  ...baseConfig,
  // Override for image-resizer package - Node.js focused
  {
    ...nodeConfig,
    files: ['**/*.{ts,js}'],
    rules: {
      ...nodeConfig.rules,
      // Image-resizer specific rules
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
]

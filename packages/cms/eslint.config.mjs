import baseConfig, {
  nodeConfig,
  typescriptConfig,
} from '../../eslint.base.config.mjs'

export default [
  ...baseConfig,
  // Override for CMS package - KeystoneJS focused
  {
    ...typescriptConfig,
    files: ['**/*.{ts,tsx}'],
    rules: {
      ...typescriptConfig.rules,
      // Suppress warnings for KeystoneJS configuration
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  // Node.js specific files for server-side code
  {
    ...nodeConfig,
    files: ['**/*.{js,ts}'],
  },
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'dist/**',
      'build/**',
      '.keystone/**',
    ],
  },
]

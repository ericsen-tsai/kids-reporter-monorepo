import baseConfig, {
  typescriptConfig,
  nodeConfig,
} from '../../eslint.base.config.mjs'

export default [
  ...baseConfig,
  // Override for core package - more strict TypeScript rules
  {
    ...typescriptConfig,
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      ...typescriptConfig.rules,
      '@typescript-eslint/no-explicit-any': 'off', // Suppress warnings
    },
  },
  // Node.js specific files
  {
    ...nodeConfig,
    files: ['src/**/*.{js,ts}'],
  },
  {
    ignores: ['lib/**', 'lib-temp/**', 'node_modules/**'],
  },
]

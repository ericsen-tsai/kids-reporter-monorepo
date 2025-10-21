import baseConfig, {
  typescriptConfig,
  javascriptConfig,
} from '../../eslint.base.config.mjs'
import globals from 'globals'

export default [
  ...baseConfig,
  // Override for draft-editor package - React/JSX focused
  {
    ...typescriptConfig,
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      ...typescriptConfig.rules,
      // Suppress warnings for draft-editor components
      '@typescript-eslint/no-explicit-any': 'off',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  {
    ...javascriptConfig,
    files: ['src/**/*.{js,jsx}'],
  },
  {
    files: ['**/*.config.{js,mjs}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
    },
    rules: {
      'no-undef': 'error',
    },
  },
  {
    ignores: ['lib/**', 'lib-temp/**', 'node_modules/**'],
  },
]

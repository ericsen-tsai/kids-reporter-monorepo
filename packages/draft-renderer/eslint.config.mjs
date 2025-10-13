import baseConfig, {
  typescriptConfig,
  javascriptConfig,
} from '../../eslint.base.config.mjs'
import globals from 'globals'

export default [
  ...baseConfig,
  // Override for draft-renderer package - React/JSX focused
  {
    ...typescriptConfig,
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      ...typescriptConfig.rules,
      // Suppress warnings for draft-renderer components
      '@typescript-eslint/no-explicit-any': 'off',
      'react-hooks/exhaustive-deps': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
  {
    ...javascriptConfig,
    files: ['src/**/*.{js,jsx}'],
  },
  {
    files: ['**/*.config.{js,mjs,cjs}'],
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

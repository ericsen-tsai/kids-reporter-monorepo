import js from '@eslint/js'
import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import prettierConfig from 'eslint-config-prettier'
import prettier from 'eslint-plugin-prettier'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'

import prettierOptions from './prettier.config.mjs'

// Browser globals (includes all standard browser APIs)
// Filter out any globals with whitespace in their keys
const filteredBrowserGlobals = Object.fromEntries(
  Object.entries(globals.browser).filter(([key]) => key === key.trim())
)

const browserGlobals = {
  ...filteredBrowserGlobals,
  ...globals.es2022,
  React: 'readonly',
}

// Node.js globals
const nodeGlobals = {
  ...globals.node,
  ...globals.es2022,
}

// Common rules
const commonRules = {
  'prettier/prettier': ['error', prettierOptions],
  'react/display-name': 'off',
  'react/prop-types': 'off',
  'simple-import-sort/imports': 'error',
  'simple-import-sort/exports': 'error',
  'no-duplicate-imports': 'error',
}

// TypeScript rules
const typescriptRules = {
  ...commonRules,
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_',
    },
  ],
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
  '@typescript-eslint/ban-ts-comment': [
    'error',
    {
      'ts-ignore': 'allow-with-description',
      minimumDescriptionLength: 5,
    },
  ],
  '@typescript-eslint/no-unused-expressions': 'off',
  'react-hooks/exhaustive-deps': 'warn',
}

// React rules
const reactRules = {
  ...commonRules,
  'no-html-link-for-pages': 'off',
  'react-hooks/exhaustive-deps': 'warn',
}

// Common settings
const commonSettings = {
  react: {
    version: 'detect',
  },
}

// Base configuration for TypeScript files
export const typescriptConfig = {
  files: ['**/*.{ts,tsx}'],
  languageOptions: {
    parser: typescriptParser,
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
    globals: browserGlobals,
  },
  plugins: {
    '@typescript-eslint': typescript,
    react,
    'react-hooks': reactHooks,
    prettier,
    'simple-import-sort': simpleImportSort,
  },
  rules: {
    ...typescript.configs.recommended.rules,
    ...react.configs.recommended.rules,
    ...reactHooks.configs.recommended.rules,
    ...prettierConfig.rules,
    ...typescriptRules,
  },
  settings: commonSettings,
}

// Base configuration for JavaScript files
export const javascriptConfig = {
  files: ['**/*.{js,jsx}'],
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    globals: browserGlobals,
  },
  plugins: {
    react,
    'react-hooks': reactHooks,
    prettier,
    'simple-import-sort': simpleImportSort,
  },
  rules: {
    ...react.configs.recommended.rules,
    ...reactHooks.configs.recommended.rules,
    ...prettierConfig.rules,
    ...reactRules,
  },
  settings: commonSettings,
}

// Base configuration for Node.js files (server-side)
export const nodeConfig = {
  files: ['**/*.{js,ts}'],
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    globals: nodeGlobals,
  },
  plugins: {
    '@typescript-eslint': typescript,
    prettier,
    'simple-import-sort': simpleImportSort,
  },
  rules: {
    ...typescript.configs.recommended.rules,
    ...prettierConfig.rules,
    ...typescriptRules,
  },
}

// Base configuration for config files (prettier.config.mjs, eslint.config.mjs, etc.)
export const configFileConfig = {
  files: [
    '**/*.config.{js,mjs,cjs}',
    '**/eslint.config.{js,mjs}',
    '**/prettier.config.{js,mjs}',
  ],
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    globals: nodeGlobals,
  },
  plugins: {
    '@typescript-eslint': typescript,
    prettier,
    'simple-import-sort': simpleImportSort,
    react,
    'react-hooks': reactHooks,
  },
  rules: {
    ...typescript.configs.recommended.rules,
    ...prettierConfig.rules,
    ...typescriptRules,
    'no-undef': 'error',
  },
}

// Common ignore patterns
export const ignorePatterns = [
  'node_modules/**',
  'dist/**',
  'build/**',
  '.next/**',
  'coverage/**',
  '*.min.js',
  'lib/**',
  'lib-temp/**',
]

// Default export with all configurations
export default [
  js.configs.recommended,
  typescriptConfig,
  javascriptConfig,
  nodeConfig,
  configFileConfig,
  {
    ignores: ignorePatterns,
  },
]

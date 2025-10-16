import baseConfig, {
  typescriptConfig,
  javascriptConfig,
} from '../../eslint.base.config.mjs'
import globals from 'globals'

export default [
  ...baseConfig,
  // Override for routing-ui package - React/TypeScript focused
  {
    ...typescriptConfig,
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      ...typescriptConfig.rules,
    },
  },
  {
    ...javascriptConfig,
    files: ['src/**/*.{js,jsx}'],
    rules: {
      ...javascriptConfig.rules,
      // Tailwind CSS classname sorting rules
      'no-restricted-syntax': [
        'warn',
        {
          selector: 'JSXAttribute[name.name="className"]',
          message:
            'Tailwind CSS classes should be sorted. Use prettier-plugin-tailwindcss for automatic sorting.',
        },
        {
          selector: 'JSXAttribute[name.name="class"]',
          message:
            'CSS classes should be sorted. Consider using a class sorting tool.',
        },
      ],
    },
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
    ignores: ['node_modules/**', 'dist/**', 'build/**'],
  },
]

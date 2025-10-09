import baseConfig, {
  typescriptConfig,
  javascriptConfig,
} from '../../eslint.base.config.mjs'

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
    files: ['src/**/*.{js,jsx,cjs}'],
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
    ignores: ['node_modules/**', 'dist/**', 'build/**'],
  },
]

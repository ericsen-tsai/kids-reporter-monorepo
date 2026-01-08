/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
export default {
  printWidth: 80,
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  arrowParens: 'always',
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindStylesheet: './src/globals.css',
  tailwindFunctions: ['clsx', 'cn', 'cva'],
  overrides: [
    {
      files: '*.graphql',
      options: {
        tabWidth: 2,
      },
    },
  ],
}

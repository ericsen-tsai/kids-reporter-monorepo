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
  tailwindStylesheet: './src/styles.css',
  tailwindFunctions: ['clsx', 'cn', 'cva'],
}

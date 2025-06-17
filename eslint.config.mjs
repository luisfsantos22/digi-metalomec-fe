import { FlatCompat } from '@eslint/eslintrc'
import { default as js } from '@eslint/js'
import nextPlugin from '@next/eslint-plugin-next'
import parser from '@typescript-eslint/parser'
import globals from 'globals'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
})

const eslintConfig = [
  ...compat.extends(
    'next/core-web-vitals',
    'eslint:recommended',
    'prettier',
    'plugin:import/typescript',
    'plugin:promise/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime'
  ),
  {
    files: ['**/*.js', '**/*.ts', '**/*.tsx'],
    ignores: ['**/node_modules/**', '**/.next/**', '**/dist/**', '**/build/**'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: { ...globals.browser, ...globals.node },
      parser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      'no-unused-vars': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react/display-name': 'off',
      'react/prop-types': 'off',
      'newline-before-return': 'error',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'import/no-unresolved': 'off',
      'import/no-named-as-default': 'off',
      // ! TO COMPILE SHADCN EXAMPLES, PLEASE REMOVE AS NEEDED
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'react/no-unescaped-entities': 'off',
      'react/no-unknown-property': 'off',
      'tailwindcss/no-unnecessary-arbitrary-value': 'off',
      'tailwindcss/classnames-order': 'off',
      'import/named': 'off',
      'import/no-named-as-default-member': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]

export default eslintConfig

import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist', 'node_modules', '*.config.js', 'build', '*.sh', 'setup-*.sh', '**/test-*.js', '**/*.test.js'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        process: 'readonly', // ✅ Allow process.env in browser context (Vite)
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react/prop-types': 'off', // ✅ Disable prop-types validation (using TypeScript)
      'react/no-unescaped-entities': 'off', // ✅ Allow quotes/apostrophes in JSX
      'react/jsx-no-undef': 'warn', // ✅ Warn instead of error for undefined components
      'react/no-unknown-property': ['warn', { ignore: ['cmdk-input-wrapper', 'toast-close'] }], // ✅ Warn for custom attributes
      'no-empty': 'warn', // ✅ Warn instead of error for empty blocks
      'no-unreachable': 'warn', // ✅ Warn instead of error
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  // Override for Node.js files (API routes, scripts)
  {
    files: [
      'api/**/*.js',
      '**/check-*.js',
      '**/create-*.js',
      '**/diagnose-*.js',
      '**/run-*.js',
      '**/test-*.js',
      '**/debug-*.js',
      'scripts/**/*.js',
      'src/utils/webSearchTools.js', // ✅ Node.js file with require
      'src/services/functions.js' // ✅ Node.js file with require
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.node,
        process: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-constant-condition': 'off', // Allow while(true) in scripts
    },
  },
]

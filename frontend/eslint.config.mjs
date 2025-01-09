import tsParser from '@typescript-eslint/parser'; // Import TypeScript parser
import prettierPlugin from 'eslint-plugin-prettier'; // Import Prettier plugin
import prettierConfig from './prettier.config.cjs'; // Import Prettier configuration

export default [
    {
        // Target TypeScript files
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: tsParser, // Use the imported TypeScript parser
            parserOptions: {
                ecmaVersion: 'latest', // Use the latest ECMAScript version
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true, // Enable JSX for React
                },
            },
        },
        plugins: {
            prettier: prettierPlugin, // Use Prettier plugin
        },
        rules: {
            // Enforce Prettier rules
            'prettier/prettier': ['error', prettierConfig],
            // Disable ESLint's newline enforcement to avoid conflicts
            'eol-last': ['error', 'never'],
        },
        ignores: [
            // Ignore folders
            'node_modules/',
            'dist/',
            'build/',
        ],
    },
    {
        // Add a general configuration for other file types (e.g., JavaScript)
        files: ['**/*.js', '**/*.jsx'],
        languageOptions: {
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            'prettier/prettier': ['error', prettierConfig],
            'eol-last': ['error', 'never'],
        },
    },
];
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import jsdoc from 'eslint-plugin-jsdoc';
import reactPlugin from 'eslint-plugin-react';

export default tseslint.config(eslint.configs.recommended, tseslint.configs.recommended, {
    settings: {
        react: {
            version: 'detect',
        },
        'import/ignore': ['react-native'],
        'import/resolver': {
            node: {
                extensions: ['.js', '.ts', '.tsx'],
            },
        },
    },
    files: ['src/**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    ignores: ['node_modules', 'dist', 'devtools'],
    plugins: {
        jsdoc: jsdoc,
        react: reactPlugin,
    },
    languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
            ecmaVersion: 6,
            sourceType: 'module',
            ecmaFeatures: {
                jsx: true,
                experimentalObjectRestSpread: true,
            },
        },
    },
    rules: {
        'linebreak-style': ['error', 'unix'],
        'react/jsx-uses-react': 1,
        'react/jsx-no-undef': 2,
        'react/jsx-wrap-multilines': 2,
        'react/no-string-refs': 0,
        'jsdoc/no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'jsdoc/no-redeclare': 'off',
        '@typescript-eslint/no-redeclare': ['error'],
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/ban-ts-comment': 'off',
    },
});

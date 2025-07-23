import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { defineConfig, globalIgnores } from 'eslint/config';
import _import from 'eslint-plugin-import';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default defineConfig([
    globalIgnores(['**/node_modules', '**/*.js', '**/dist']),
    {
        extends: fixupConfigRules(
            compat.extends(
                'eslint:recommended',
                'plugin:react/recommended',
                'plugin:react/jsx-runtime',
                'plugin:react-hooks/recommended',
                'plugin:jsx-a11y/recommended',
                'prettier',
            ),
        ),
        plugins: {
            '@typescript-eslint': typescriptEslint,
            'simple-import-sort': simpleImportSort,
            import: fixupPluginRules(_import),
            'react-refresh': reactRefresh,
        },
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
            parser: tsParser,
            ecmaVersion: 2020,
            sourceType: 'module',
        },
        settings: {
            react: {
                version: 'detect',
                linkComponents: [
                    {
                        name: 'Link',
                        linkAttribute: 'to',
                    },
                ],
            },
        },
        rules: {
            curly: 'warn',
            eqeqeq: ['error', 'smart'],
            'import/first': 'warn',
            'import/newline-after-import': 'warn',
            'import/no-duplicates': 'warn',
            'import/no-named-as-default-member': 'warn',
            'import/prefer-default-export': 'off',
            'import/no-default-export': 'error',
            'import/no-cycle': [
                'warn',
                {
                    ignoreExternal: true,
                },
            ],
            'jsx-a11y/alt-text': [
                'error',
                {
                    elements: ['img'],
                    img: ['Image'],
                },
            ],
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'none',
                    varsIgnorePattern: '(^_|React)',
                },
            ],
            // 'no-confusing-arrow': 'warn',
            'no-constructor-return': 'warn',
            'no-eval': 'error',
            'no-extend-native': 'error',
            'no-extra-semi': 'off',
            'react/no-unknown-property': 'off',
            'no-implied-eval': 'error',
            'no-promise-executor-return': 'warn',
            // 'implicit-arrow-linebreak': ['warn', 'beside'],
            'no-restricted-imports': [
                'error',
                {
                    paths: [
                        {
                            name: 'lodash',
                            importNames: ['default'],
                            message:
                                "Please import a single lodash method, e.g. import { pick } from 'lodash', or single method package, e.g. import pick from 'lodash/pick'.",
                        },
                    ],
                },
            ],
            'react-refresh/only-export-components': [
                'warn',
                {
                    allowConstantExport: true,
                },
            ],
            'no-restricted-syntax': [
                'warn',
                'ForInStatement',
                'LabeledStatement',
                'WithStatement',
            ],
            'no-shadow': 'off',
            '@typescript-eslint/no-shadow': 'warn',
            'no-unmodified-loop-condition': 'warn',
            'no-useless-concat': 'warn',
            'no-useless-return': 'warn',
            'prefer-arrow-callback': [
                'warn',
                {
                    allowNamedFunctions: true,
                },
            ],
            'prefer-const': 'warn',
            'prefer-destructuring': 'warn',
            'react/destructuring-assignment': [
                'warn',
                'always',
                {
                    destructureInSignature: 'always',
                },
            ],
            'react/jsx-boolean-value': 'warn',
            'react/jsx-curly-brace-presence': [
                'warn',
                {
                    props: 'never',
                    children: 'ignore',
                    propElementValues: 'always',
                },
            ],
            'react/jsx-newline': [
                'warn',
                {
                    prevent: true,
                },
            ],
            'react/jsx-no-constructed-context-values': 'error',
            'react/jsx-no-undef': 'off',
            'react/jsx-no-useless-fragment': [
                'warn',
                {
                    allowExpressions: true,
                },
            ],
            'react/no-array-index-key': 'error',
            'react/no-multi-comp': 'warn',
            'react/no-object-type-as-default-prop': 'error',
            'react/prop-types': 'off',
            'react/void-dom-elements-no-children': 'error',
            'require-await': 'warn',
            'simple-import-sort/exports': 'warn',
            'simple-import-sort/imports': [
                'warn',
                {
                    groups: [
                        [
                            '^\\u0000',
                            '^node:',
                            '^react',
                            '^@?\\w',
                            '^',
                            '^~/.+',
                            '^\\.',
                            '^.+\\.css$',
                            '^.+\\.styles$',
                        ],
                    ],
                },
            ],
            yoda: [
                'warn',
                'never',
                {
                    exceptRange: true,
                },
            ],
        },
    },
    {
        files: ['./**/*.{ts,tsx}'],
        extends: compat.extends('plugin:@typescript-eslint/recommended'),
        rules: {
            '@typescript-eslint/no-empty-interface': 'off',
        },
    },
    {
        files: ['./app/**/*.tsx', './**/*.stories.tsx', './**/*.stories.ts'],
        rules: {
            'react/no-multi-comp': 'off',
        },
    },
    {
        files: ['**/*.d.ts', 'eslint.config.mjs', 'vite.config.ts'],
        rules: {
            'import/no-default-export': 'off',
        },
    },
]);

module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: 'tsconfig.json',
      tsconfigRootDir : __dirname,
      sourceType: 'module',
    },
    plugins: ['@typescript-eslint/eslint-plugin'],
    extends: [
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
    ],
    root: true,
    env: {
      browser: true,
      jest: true,
      es2021: true
    },
    ignorePatterns: ['.eslintrc.js'],
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      "prefer-arrow-callback": ["error", { "allowNamedFunctions": true }],
      "no-underscore-dangle": ["error", { "allow": ["_id", "_doc", "_source"] }],
      "comma-dangle": ["error", {
        "arrays": "always-multiline",
        "objects": "always-multiline",
        "imports": "always-multiline",
        "exports": "always-multiline",
        "functions": "ignore"
      }],
      "no-param-reassign": "off",
      "no-prototype-builtins": "warn",
      "no-restricted-properties": "off",
      "operator-linebreak": "off",
      "max-len": ["error", { "code": 160, "tabWidth": 2 }],
      "import/no-useless-path-segments": "off",
      "import/prefer-default-export": "off",
      "class-methods-use-this": "off",
      "prettier/prettier": [
        "warn",
        {
          singleQuote: true,
          semi: true,
          printWidth: 160
        }
      ],
    },
  };
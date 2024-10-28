module.exports = {
  extends: ['@mate-academy/eslint-config-react-typescript',
    'plugin:prettier/recommended'
  ],
  rules: {
    'max-len': ['error', {
      ignoreTemplateLiterals: true,
      ignoreComments: true,
    }],
    'jsx-a11y/label-has-associated-control': ["error", {
      assert: "either",
    }],
    'import/no-extraneous-dependencies': ["error", { devDependencies: ["**/*.test.ts", "**/MyMapComponent.tsx"] }],
    'prettier/prettier': ['error', { // Налаштовуємо Prettier, щоб уникнути проблем з відступами
      tabWidth: 2,
      singleQuote: true,
      trailingComma: 'all',
      printWidth: 80,
      bracketSpacing: true,
    }],
  },
};

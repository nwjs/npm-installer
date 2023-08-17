module.exports = {
  parserOptions: {
    ecmaVersion: 2023,
  },
  env: {
    node: true,
  },
  ignorePatterns: ['node_modules', 'package.json', 'package-lock.json'],
  extends: ['eslint:recommended'],
  rules: {
    quotes: ['error', 'single'],
  },
};

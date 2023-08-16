module.exports = {
  parserOptions: {
    ecmaVersion: 2023,
  },
  env: {
    node: true,
  },
  extends: ["eslint:recommended"],
  rules: {
    quotes: [
      'error',
      'single'
    ]
  }
};

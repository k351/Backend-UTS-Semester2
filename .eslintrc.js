module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'prettier', 'plugin:security/recommended'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'prettier/prettier': ['error'],
    'security/detect-object-injection': 'off',
  },
};

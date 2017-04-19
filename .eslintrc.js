module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
    jquery: true
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: [
  ],
  // add your custom rules here
  rules: {
    "semi": 0,
    "max-len": [2, 1000],
    "arrow-body-style": ["error", "as-needed", { requireReturnForObjectLiteral: true }],
    "comma-dangle": ["error", "only-multiline"],
    "dot-notation": 0,
    "prefer-arrow-callback": 0,
    "func-names": 0,
    "quotes": [2, "single"],
    "strict": [2, "never"],
    "new-cap": 0,
    "space-before-blocks": 0,
    "space-before-function-paren": 0,
    "no-param-reassign": 0,
    "no-unused-vars": 0,
    "no-console": 0,
    "no-alert": 0,
    "object-shorthand": [2, "consistent"],
    "object-curly-spacing": 0,
    "arrow-body-style": ["error", "as-needed"],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}

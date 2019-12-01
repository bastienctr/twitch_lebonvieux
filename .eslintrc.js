module.exports = {
    env: {
      browser: true,
      commonjs: true,
      es6: true,
      jest: true,
    },
    extends: [],
    globals: {
      Atomics: 'readonly',
      SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: "module"
    },
    rules: {
      "max-len": ["warn", {"code": 120}],
      "indent": ["error", 2],
      "quotes": ["error", "double"],
      "no-trailing-spaces": ["error"],
      "semi": ["error", "always"],
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "react/prop-types": "off",
      "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 1 }]
    },
  };
  
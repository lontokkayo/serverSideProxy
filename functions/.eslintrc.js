module.exports = {
  env: {
    browser: true, // If you're using React, you're likely targeting browsers
    es2021: true,
    node: true, // Specifies Node.js environment
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended' // If using React, otherwise remove this line
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true, // Enable linting for JSX if using React
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react' // If using React, otherwise remove this line
  ],
  rules: {
    // Your custom rules here
  },
  settings: {
    react: {
      version: 'detect', // Automatically detect the React version
    },
  },
};

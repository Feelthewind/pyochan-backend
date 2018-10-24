const path = require('path');

module.exports = {
  extends: 'airbnb-base',
  settings: {
    'import/resolver': {
      node: { paths: [path.resolve('./')] }
    }
  },
  rules: {
    'no-unused-vars': 1,
    'comma-dangle': 0,
    'eol-last': 0,
    'no-console': 0,
    'linebreak-style': 0,
    'import/no-unresolved': 0,
    'no-plusplus': 0,
    'no-throw-literal': 0,
    camelcase: 0,
    'no-new': 0
  }
};

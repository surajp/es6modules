const path = require('path');

module.exports = {
  entry: './es6-modules/app.mjs',
  output: {
    filename: 'main.mjs',
    path: path.resolve(__dirname, 'out')
  },
  mode: "development"
};
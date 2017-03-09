const path = require('path')

module.exports = {
  entry: './src/index.js',
  devServer: {
    contentBase: path.resolve('./www')
  },
  output: {
    path: path.resolve('./www'),
    filename: 'bundle.js'
  }
}
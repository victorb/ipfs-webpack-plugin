const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// Replace `../ipfs-webpack-plugin` with `ipfs-webpack-plugin` in your application
const IPFSWebpackPlugin = require('../ipfs-webpack-plugin')

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new IPFSWebpackPlugin()
  ]
}

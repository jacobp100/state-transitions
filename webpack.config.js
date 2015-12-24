module.exports = {
  context: __dirname,
  entry: './src/index',
  devtool: 'source-map',
  target: 'node',
  externals: {
    'react': true,
    'react-dom': true,
    'lodash': true,
  },
  output: {
    filename: 'index.js',
    library: 'state-transitions',
    libraryTarget: 'umd',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
};

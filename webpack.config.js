module.exports = {
  context: __dirname,
  entry: './src/index',
  devtool: 'source-map',
  target: 'node',
  output: {
    filename: 'index.js',
    library: 'state-transitions',
    libraryTarget: 'umd',
  },
  externals: {
    'react': true,
    'react-dom': true,
    'lodash': true,
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
      },
    ],
  },
};

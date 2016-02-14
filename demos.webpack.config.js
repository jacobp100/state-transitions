var path = require('path');

module.exports = {
  context: __dirname,
  entry: {
    pokemon: './demos/pokemon',
    buttonModal: './demos/button-modal',
  },
  output: {
    filename: './demos/dist/[name].js',
    library: 'demo',
    libraryTarget: 'umd',
  },
  devtool: 'source-map',
  resolve: {
    alias: {
      'react': path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
    },
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
    ],
  },
};

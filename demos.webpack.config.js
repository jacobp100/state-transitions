var path = require('path');

// You need to use Lodash 3 to compile these

module.exports = {
  context: __dirname,
  entry: {
    pokemon: './demos/pokemon',
    buttonModal: './demos/dinosaur-boutique',
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
        loader: 'babel',
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
    ],
  },
};

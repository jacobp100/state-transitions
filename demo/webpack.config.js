var path = require('path');

module.exports = {
	context: path.join(__dirname, 'src'),
	entry: './index',
	devtool: 'source-map',
	output: {
		filename: 'index.js',
		library: 'reanimate-demo',
		libraryTarget: 'umd'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader?loose=all'
			},
			{
				test: /\.json$/,
				loader: 'json'
			}
		]
	}
};

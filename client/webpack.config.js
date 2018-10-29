const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const loaders = require('./webpack.loaders');

const BUILD_DIR = path.resolve(__dirname, 'dist');
const APP_DIR = path.resolve(__dirname, 'src/js');
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || '5051';

loaders.push({
	test: /\.scss$/,
	loaders: ['style-loader', 'css-loader?importLoaders=1', 'sass-loader'],
	exclude: ['node_modules'],
});


const config = {
	entry: `${APP_DIR}/index.jsx`,
	output: {
		publicPath: '/',
		path: BUILD_DIR,
		filename: 'bundle.js',
	},
	resolve: {
		extensions: ['.js', '.jsx'],
	},
	module: {
		loaders,
	},
	devServer: {
		contentBase: './public',
		noInfo: true,
		hot: true,
		inline: true,
		port: PORT,
		host: HOST,
	},
	plugins: [
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new ManifestPlugin(),
		new ExtractTextPlugin({
			filename: 'style.css',
			allChunks: true,
		}),
		new DashboardPlugin(),
		new HtmlWebpackPlugin({
			favicon: 'src/i/favicon.ico',
			template: 'src/template.ejs',
			files: {
				css: ['dist/style.css'],
				js: ['dist/bundle.js'],
			},
		}),
	],
};

module.exports = config;

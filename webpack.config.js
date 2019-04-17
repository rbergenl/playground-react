const	path = require('path'),
		autoprefixer = require('autoprefixer');

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WebappWebpackPlugin = require('webapp-webpack-plugin');
var JsonPostProcessPlugin = require('json-post-process-webpack-plugin')

const extractSass = new ExtractTextPlugin({
    filename: "[name].[contenthash].css"
    //disable: process.env.NODE_ENV === "development"
});

const HtmlWebpackPlugin = require('html-webpack-plugin');

const WorkboxPlugin = require('workbox-webpack-plugin');

/*
  Are we in production mode? We also include staging (or any other non-
  development environment) as prod-like for webpack purposes, but pass
  the actual environment to the config file.
*/
const NODE_ENV = process.env.NODE_ENV || 'development';
const prodLike = (NODE_ENV !== 'development');

module.exports = {
	output: {
    	path: path.resolve(__dirname, 'public/build'),
    	publicPath: 'build/'
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
		alias: {
	      // Special config path based on environment
	      config$: path.join(__dirname, 'src/config', NODE_ENV),
	      firebaseApp$: path.join(__dirname, 'src/firebaseApp')
	    }
	},
	module: {
		rules: [
			// CSS
		    {
		    	test: /\.scss$/,
	            //loaders: ["file-loader?name=main.css", "extract-loader?publicPath=null", 'css-loader', 'resolve-url-loader', 'sass-loader?sourceMap']
	            use: extractSass.extract({
	                use: [{
	                    loader: "css-loader"
	                }, {
	                    loader: "resolve-url-loader"
	                }, {
	                    loader: "sass-loader"
	                }],
	                // use style-loader in development
	                fallback: "style-loader"
	            })
            },
        
			{
				test: /\.ts(x?)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader'
					},
					{
						loader: 'ts-loader'
					}
				]
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			}
		]
	},
	plugins: [
	//	new CleanWebpackPlugin(['public']),
		new JsonPostProcessPlugin({
	      matchers: [{
	        matcher: /manifest.json$/,
	        action: (currentJsonContent) => (Object.assign(currentJsonContent, { gcm_sender_id: '103953800507' }))
	      }]
	    }),
		new HtmlWebpackPlugin({
	    	template: 'src/index.html',
	    	filename: '../index.html',
	    	inject: true,
	    	alwaysWriteToDisk: true
	    }),
		new WorkboxPlugin.InjectManifest({
	      globDirectory: './src',
	      globPatterns: ['**\/*.{html,js,css}'],
	      globIgnores: ['admin.html', 'node_modules/**', 'service-worker.js',
	        'webpack.config.js', 'src/**', 'build/**'],
	      swSrc: './src/service-worker.js',
	      swDest: '../service-worker.js',
	    }),
		extractSass,
		new WebappWebpackPlugin({
			logo: path.join(__dirname, 'src/assets/icon/icon.png'), // svg works too!
			prefix: '../assets/[hash]/',
			favicons: {
		      appName: 'my-app',
		      appDescription: 'My awesome App',
		      developerName: 'Me',
		      developerURL: null, // prevent retrieving from the nearest package.json
		      background: '#ddd',
		      theme_color: '#333',
		      icons: {
		        coast: false,
		        yandex: false
		      }
		    }
		})
    ],
    devServer: {
    	contentBase: path.join(__dirname, 'public'),
    	watchContentBase: true,
    	historyApiFallback: true
    }
};
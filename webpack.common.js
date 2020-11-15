const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require("path");
const basePath = __dirname;

module.exports = { 
  context: path.join(basePath, 'src'),
  resolve: {
    extensions: [".js",".ts", ".tsx"]
  },
  entry: {
    app: './index.tsx',// creamos dos archivos uno para el js y otro para el style pueden ir entre corchetes
    appStyles: ["./mystyles.scss"], // no haría falta en este caso pero si hubiera más css sí
    // les puedes poner el nombre que tú quieras, mejor que tengan sentido
    vendorStyles: ['../node_modules/bootstrap/dist/css/bootstrap.css'],
  },
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(process.cwd(), "dist"),
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // Mírame los ficheros que tengan la extensión *.js
        exclude: /node_modules/, // No mire en la carpeta node_modelues
        loader: "babel-loader", // utilice el loader babel-loader para eso
      },
      {
        test: /\.(png|jpg)$/,
        type: "asset/resource",
      },
      {
        test: /\.html$/,
        loader: "html-loader",
      },
      {
        test: /\.css$/,       
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              import: false,
              modules: {
                exportLocalsConvention: "camelCase",
                localIdentName: '[path][name]__[local]--[hash:base64:5]',
                localIdentContext: path.resolve(__dirname, 'src'),
                localIdentHashPrefix: 'my-custom-hash',
              },
            }
          },
          {
            loader: "sass-loader",
            options: {
              implementation: require("sass"),
            },
          },
        ],
      },
    ],
  },
  devServer: {
      port: 8085,
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html", //  y donde lo escupe en el dist
      template: "index.html", // nombre en el src, donde parte
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].[chunkhash].css",
      chunkFilename: "[id].css",
    }),
  ],
};
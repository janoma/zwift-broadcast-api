const path = require("path");
const { experiments } = require("webpack");
const { library } = require("webpack");

module.exports = {
  entry: "./src/index.ts",
  experiments: {
    outputModule: true,
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    library: { type: "module" },
  },
  resolve: {
    extensions: [".ts"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
      },
    ],
  },
};

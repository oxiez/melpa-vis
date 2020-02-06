const path = require("path");

module.exports = {
    entry: "./js/index.js",
    output: {
        filename: "index_bundle.js",
        path: path.resolve(__dirname, "dist")
    },
    resolve: {
        extensions: [".js"],
        modules: [
            path.resolve(__dirname, "js"),
            path.resolve(__dirname, "node_modules")
        ]
    }
};

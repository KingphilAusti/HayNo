module.exports = {
    extension: ["js", "mjs", "ts", "tsx"],
    ignore: ["**/build/**", "**/node_modules/**"],
    recursive: true,
    reporter: "dot",
    require: [require.resolve("./test/utils/setupBabel/setupBabel.js")],
    "watch-ignore": [
        ".git",
        "**/node_modules/**",
        "**/build/**",
        "docs/.next/**",
    ],
};

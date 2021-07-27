const caxa = require('caxa').default;

(async () => {
    await caxa({
        input: ".",
        output: "ayanbot.exe",
        command: [
            "{{caxa}}/node_modules/.bin/node",
            "{{caxa}}/index.js",
            "CAXA"
        ],
        exclude: [
            "**/executable/**",
            "**/commands/**",
            "config.json",
            "*.md",
            ".*",
            "*.log",
            "eslintrc.json"
        ]
    });
})();
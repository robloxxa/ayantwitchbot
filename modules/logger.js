/*
Logger class for easy and aesthetically pleasing console logging 
*/
const chalk = require('chalk')

module.exports = (client) => {
    const self = {
        log: (content, type = "log") => {
            switch (type) {
                case "log": {
                    return console.log(`[${chalk.blueBright(type.toUpperCase())}] ${content} `);
                }
                case "warn": {
                    return console.log(`[${chalk.yellow(type.toUpperCase())}] ${content} `);
                }
                case "error": {
                    return console.log(`[${chalk.red(type.toUpperCase())}] ${content} `);
                }
                case "debug": {
                    if (!client.config || !client.config.debug) return
                    return console.log(`[${chalk.magenta(type.toUpperCase())}] ${content} `);
                }
                case "cmd": {
                    return console.log(`[${chalk.gray(type.toUpperCase())}] ${content}`);
                }
                case "ready": {
                    return console.log(`[${chalk.green(type.toUpperCase())}] ${content}`);
                }
                default:
                    throw new TypeError("Logger type must be either warn, debug, log, ready, cmd or error.");
            }
        },
        error: (...args) => self.log(...args, "error"),

        warn: (...args) => self.log(...args, "warn"),

        debug: (...args) => self.log(...args, "debug"),

        cmd: (...args) => self.log(...args, "cmd"),

        ready: (...args) => self.log(...args, "ready")
    }
    return self
};


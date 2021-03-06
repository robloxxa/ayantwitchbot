const { outputJson, pathExists, copy } = require('fs-extra');
const defaultConfig = require('./config.default.json')
const prompts = require("prompts");
const configPath = process.cwd()+'\\config.json'
const defaultCommandsPath = process.cwd()+'\\commands\\defaultCommands'
const chalk = require('chalk')

const onCancel = () => { throw 'Config Setup have been interrupted, please restart the bot' }
module.exports = async (client) => {
    try {
        await copy(__dirname + '\\defaultCommands', defaultCommandsPath, {overwrite: false})
        if (!await pathExists(configPath)) {
            process.title = "Config setup"
            const language = await prompts({
                type: 'select',
                name: 'value',
                message: 'What language you want to run bot on?',
                choices: [
                    {title: 'English', value: 'en_US'},
                    {title: 'Russian', value: 'ru_RU'}, //TODO: Load from languages folder
                ],
            }, {onCancel});

            client.interface = require('./languages/' + language.value + '.json')
            console.log(chalk.yellow(client.interface.setup.paste))
            const config = await prompts([
                {
                    type: 'text',
                    name: 'osuUsername',
                    message: client.interface.setup.osuUsername,
                    validate: (value) => value === "" ? client.interface.incorrectString : true
                },
                {
                    type: 'text',
                    name: 'osuApiKey',
                    message: client.interface.setup.osuApiKey,
                    validate: (value) => value === "" ? client.interface.incorrectString : true
                },
                {
                    type: 'text',
                    name: 'osuIRCPassword',
                    message: client.interface.setup.osuIRCPassword,
                    validate: (value) => value === "" ? client.interface.incorrectString : true
                },
                {
                    type: 'text',
                    name: 'twitchBotToken',
                    message: client.interface.setup.twitchBotToken,
                    validate: (value) => value === "" ? client.interface.incorrectString : true
                },
                {
                    type: 'text',
                    name: 'twitchChannelName',
                    message: client.interface.setup.twitchChannelName,
                    validate: (value) => value === "" ? client.interface.incorrectString : true
                }], {onCancel})

            config.language = language.value
            for (let i of Object.keys(defaultConfig)) {
                if (!config[i]) config[i] = defaultConfig[i]
            }
            await outputJson(configPath, config, {spaces: 2})
            client.config = require(configPath)
        } else {
            client.config = require(configPath)
            let edited = false
            for (let i of Object.keys(defaultConfig)) {
                if (!client.config[i]) {
                    edited = true
                    client.config[i] = defaultConfig[i]
                }
            }
            if (edited) await outputJson(configPath, client.config, {spaces: 2})
            client.interface = require('./languages/' + client.config.language + '.json')
        }
    } catch (e) {
        throw e
    }
}

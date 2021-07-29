const { writeFileSync, existsSync } = require('fs');
const defaultConfig = require ('./config.default.json')
const prompts = require("prompts");
const configPath = process.cwd()+'\\config.json'
const chalk = require('chalk')
module.exports = async (client) => {
    if (!existsSync(configPath)) {
        process.title = "Config setup"
        const language = await prompts({
            type: 'select',
            name: 'value',
            message: 'What language you want to run bot on?',
            choices: [
                {title: 'English', value: 'en_US'},
                {title: 'Russian', value: 'ru_RU'}, //TODO: Load from languages folder
            ],
        });

        client.interface = require('./languages/'+language.value+'.json')
        console.log(chalk.red(client.interface.setup.paste))
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
            },
            {
                type: 'text',
                name: 'prefix',
                initial: '!',
                message: client.interface.setup.prefix,
                // validate: (value) => value === "" ? client.interface.incorrectString : true
            }])

        config.language = language.value
        for (let i of Object.keys(defaultConfig)) {
            if (!config[i]) config[i] = defaultConfig[i]
        }
        writeFileSync(configPath, JSON.stringify(config, null, 2))
        client.config = require(configPath)
    } else {
        client.config = require(configPath)
        for (let i of Object.keys(defaultConfig)) {
            if (!client.config[i]) client.config[i] = defaultConfig[i]
        }
        client.interface = require('./languages/' + client.config.language + '.json')
    }
}

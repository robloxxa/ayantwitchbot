const { writeFileSync, existsSync, mkdirSync, readdirSync } = require('fs');
const defaultConfig = require ('./config.default.json')
const prompts = require("prompts");
const configPath ='./config.json'
const commandsFolder = process.cwd()+'//commands'

module.exports = async (client) => {
    if (!existsSync(commandsFolder)) mkdirSync(commandsFolder)
    if (!existsSync(configPath)) {
        process.title = "Config setup"
        const languages = readdirSync('./languages')
        const language = await prompts({
            type: 'select',
            name: 'value',
            message: 'What language you want to run bot on?',
            choices: [
                {title: 'English', value: 'en_US'},
                {title: 'Russian', value: 'ru_RU'},
            ],
        });

        client.language = require('./languages/'+language.value+'.json')

        const config = await prompts([
            {
                type: 'text',
                name: 'osuUsername',
                message: client.language.setup_osuUsername,
                validate: (value) => value === "" ? client.language.incorrectString : true
            },
            {
                type: 'password',
                name: 'osuApiKey',
                message: client.language.setup_osuApiKey,
                validate: (value) => value === "" ? client.language.incorrectString : true
            },
            {
                type: 'password',
                name: 'osuIRCPassword',
                message: client.language.setup_osuIRCPassword,
                validate: (value) => value === "" ? client.language.incorrectString : true
            },
            {
                type: 'password',
                name: 'twitchBotToken',
                message: client.language.setup_twitchBotToken,
                validate: (value) => value === "" ? client.language.incorrectString : true
            },
            {
                type: 'text',
                name: 'twitchChannelName',
                message: client.language.setup_twitchChannelName,
                validate: (value) => value === "" ? client.language.incorrectString : true
            },
            {
                type: 'text',
                name: 'prefix',
                initial: '!',
                message: client.language.setup_prefix,
                // validate: (value) => value === "" ? client.language.incorrectString : true
            }])

        config.language = language.value
        for (let i of Object.keys(defaultConfig)) {
            if (!config[i]) config[i] = defaultConfig[i]
        }
        writeFileSync(configPath, JSON.stringify(config, null, 2))
        client.config = require('./config.json')
    } else {
        client.config = require('./config.json')
        for (let i of Object.keys(defaultConfig)) {
            if (!client.config[i]) client.config[i] = defaultConfig[i]
        }
        client.language = require('./languages/' + client.config.language + '.json')
    }
}

const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const {existsSync} = require('fs')
const client = {}

client.commands = new Map()
client.aliases = new Map()
client.regexp = new Map()


require('./modules/functions')(client)

const init = async () => {
    client.logger = require('./modules/logger')(client)
    await require('./config')(client)
    const defaultApi = await readdir('./api')
    for (const f of defaultApi) {
        if(!f.endsWith(".js")) continue
        client[f.split('.')[0]] = await require(`./api/${f}`)(client)
    }
    client.logger.ready('Bot is ready!')
}

init().catch(client.logger.error)
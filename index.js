const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const client = {}
require('./modules/functions')(client)
client.logger = require('./modules/logger')(client)
const init = async () => {
    await require('./update')(client)
    process.title = 'ayanbot'
    await require('./config')(client)
    const defaultApi = await readdir('./api')
    for (const f of defaultApi) {
        if (!f.endsWith(".js")) continue
        client[f.split('.')[0]] = await require(`./api/${f}`)(client)
    }
}

init().then(() => client.logger.ready(client.interface.bot.ready)).catch(client.logger.error)
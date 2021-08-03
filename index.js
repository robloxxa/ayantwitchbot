const { readdir } = require('fs/promises')
const client = {}
require('./modules/functions')(client)
client.logger = require('./modules/logger')(client)
const init = async () => {
    await require('./config')(client)
    process.title = 'ayantwitchbot'
    await require('./update')(client)
    const defaultApi = await readdir(__dirname+'/./api')
    for (const f of defaultApi) {
        if (!f.endsWith(".js")) continue
        client[f.split('.')[0]] = await require(`./api/${f}`)(client)
    }
}

init()
    .then(() => client.logger.ready(client.interface.bot.ready))
    .catch(async (e) => {
        client.logger.error(e)
        client.logger.warn('Program will be closed in 5 seconds')
        await setTimeout(process.exit, 5000)
    })
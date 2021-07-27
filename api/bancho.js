const Banchojs = require("bancho.js");

module.exports = async (client) => {
    try {
        const bancho = new Banchojs.BanchoClient({
            username: client.config.osuUsername,
            password: client.config.osuIRCPassword,
            apiKey: client.config.osuApiKey
        })
        await bancho.connect()
        client.logger.ready(client.interface.bancho.ready)
        if (client.config.debug) bancho.on('PM', message => client.logger.debug(message.message))
        bancho.on('disconnected', (error) => client.logger.warn(client.interface.bancho.disconnected))
        bancho.say = (message) => bancho.getSelf().sendMessage(message)
        return bancho
    } catch (e) {
        client.logger.error(client.interface.bancho.error)
        client.logger.error(e)
        client.logger.warn('Bot will not send any messages in your osu! dm. Please check your auth data in config.default.json and restart the bot')
        return {
            say: () => false
        }
    }
}




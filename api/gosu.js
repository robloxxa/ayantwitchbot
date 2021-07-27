const fetch = require('node-fetch')



module.exports = async client => {
    const self = {
        data: async () => {
            try {
                const data = await fetch('http://localhost:24050/json')
                    .then(res => res.json()).catch(e => {})
                if (!data || data.error) throw client.interface.gosu.error
                return data
            } catch (e) {
                client.logger.warn(e)
                return false
            }
        }
    }
    if (await self.data()) client.logger.ready(client.interface.gosu.ready)
    return self
}
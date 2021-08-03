const axios = require('axios')

module.exports = async client => {
    const self = {
        data: async () => {
            try {
                const { data } = await axios.get('http://localhost:24050/json').catch(() => false)
                if (!data) throw client.interface.gosu.error
                if (data.error) throw client.interface.gosu.osu_error
                return data
            } catch (e) {
                client.logger.error('(gosumemory) '+e)
                return false
            }
        }
    }
    if (await self.data()) client.logger.ready(client.interface.gosu.ready)
    return self
}
const axios = require('axios')

module.exports = async client => {
    const self = {
        data: async () => {
            try {
                const { data } = await axios.get('http://localhost:24050/json')
                if (!data || data.error) throw client.interface.gosu.error
                return data
            } catch (e) {
                client.logger.error(e)
                return false
            }
        }
    }
    if (await self.data()) client.logger.ready(client.interface.gosu.ready)
    return self
}
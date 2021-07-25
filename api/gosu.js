const fetch = require('node-fetch')



module.exports = async client => {
    const self = {
        data: async () => {
            try {
                const data = await fetch('http://localhost:24050/json')
                    .then(res => res.json()).catch(e => {})
                if (!data) throw 'gosumemory was closed or you havent yet start osu'
                if (data.error) throw data.error
                return data
            } catch (e) {
                client.logger.warn(e)
                return false
            }
        }
    }
    await self.data()
    return self
}
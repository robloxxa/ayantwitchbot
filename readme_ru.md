# Twitch bot for osu!
WIP
# Создание собственных комманд
Вы можете создавать собственные команды с помощью javascript и использовать их в боте\
**Пример:**
```
exports.conf = { // Configuration settings for command
      name: 'currentskin',
      aliases: ['cs', 'skincurrent'],
      modOnly: false,
      regexp: {
          only: false, // Set this to true if you don't wanna user call command within its name
          value: '/skin?/g'
      }
  }
  
  exports.run = async (client, channel, author, value) => {
      const data = await client.gosu.data() //fetching data from gosumemory (./api/gosu.js)
      if (!data) return client.twitch.say(channel, `Can't fetch data from streamer game`) // If no data recieved we return an error message
      client.twitch.say(channel, `Current skin: ${data.settings.folders.skin}`) 
 }
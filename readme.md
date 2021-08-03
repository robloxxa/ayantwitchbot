# Ayan Twitch bot
Bot for handling osu! related commands/links written on Node JS
## Setup
1. Download ayantwitchbot ( [Windows]() | [Linux]() )
2. Download [gosumemory](https://github.com/l3lackShark/gosumemory)
3. Start osu!
4. Start gosumemory
5. Start ayantwitchbot ( ayanbot.exe | sh ./ayanbot | node index.js)
>Please note that Linux build is not tested and can be very broken
## Default Commands
* !np - show current map\
![](https://i.imgur.com/h11lplS.png)
* !currentskin - show current skin\
![](https://i.imgur.com/FQF8hyu.png)
* !pp `accuracy` `combo` `mods` `misses` - show pp for a current map\
![](https://i.imgur.com/tWvCToL.png)
* \*osu! beatmap link\* - show beatmap info in Twitch Chat and send DM in osu!
![](https://i.imgur.com/9U96S1V.png)
![](https://i.imgur.com/JWBnvTt.png)
* \*osu! profile link\* - show user info in twitch chat\
![](https://i.imgur.com/oMnI2k5.png)
>*For !np, !currentskin and !pp you need **[gosumemory](https://github.com/l3lackShark/gosumemory)***

>*All .js command files placed at **/commands/defaultCommands** with executable file*
## Creating custom commands
You can write your own commands with javascript and use it in Bot

Script should be placed in **/commands/** folder within executable file
>If you wanna import additional files (Script, json, or Native Module), you can make folder for a command
### Example
```javascript
exports.conf = { // Configuration for commands name, aliases and regular expression
      name: 'currentskin',
      aliases: ['cs', 'skincurrent'],
      modOnly: false,
      regexp: { // If you don't need regular expression you can simply delete this object
          only: false, // If you true command will be called only by regexp
          value: '/skin?/g'
      }
  }
  
  exports.run = async (client, channel, author, value) => {
      const data = await client.gosu.data() // fetch data from gosumemory (./api/gosu.js)
      if (!data) return  // If no data - return
      client.twitch.say(channel, `Current skin: ${data.settings.folders.skin}`) 
 }
```
### Import files placed within script
```javascript
const myAnotherScript = require(process.cwd()+'//anotherscript.js') // If file placed within script
const myJson = require(process.cwd()+'//myJson.json')
const fs = require('fs') // You still can import Node js modules and modules listed in package json
```
## Config
All data specified in config setup will be placed in config.json within executable file\
```json
{
  // Your osu! username. Need for osu! chat (beatmap requests)
  "osuUsername": null, 
  // osu!api key. Need for getting beatmap info and user info
  // https://osu.ppy.sh/p/api
  "osuApiKey": null, 
  // Your osu! IRC password. Need for osu! chat (beatmap requests)
  // https://osu.ppy.sh/p/irc
  "osuIRCPassword": null, 
  // Twitch TMI Token. You can create another twitch account for bot and user its token
  "twitchBotToken": null,
  // Your twitch channel name
  "twitchChannelName": null,
  "prefix": "!",
  "language": "en_US",
  // If true console will output additional data
  "debug": false, 
  // Set to false if you want to manually update your bot
  "autoUpdate": true 
}
```
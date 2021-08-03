# Ayan Twitch bot
Bot for handling osu! related commands/links written on Node JS

* [Setup](#setup)
* [Default Commands](#default-commands)
* [Creating Custom Commands](#creating-custom-commands)
* [About Config](#config)
## Setup
1. Download ayantwitchbot ( [Windows]() | [Linux]() )
2. Download [gosumemory](https://github.com/l3lackShark/gosumemory)
3. Start osu!
4. Start gosumemory
5. Start ayantwitchbot ( ayanbot.exe | sh ./ayanbot | node index.js)
>Please note that Linux build is not tested and could be very unstable
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
          only: false, // If true, command will be called only by regexp
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
All data specified in config setup will be placed in config.json within executable file
* `osuUsername` - your osu! username. Need for osu! chat (beatmap requests)
* `osuApiKey` (https://osu.ppy.sh/p/api) - your osu!api key. Need for getting beatmap info and user info
* `osuIRCPassword` (https://osu.ppy.sh/p/irc) - your osu! IRC password. Need for osu! chat (beatmap requests)
* `twitchBotToken` (https://twitchapps.com/tmi) - twitch TMI Token. You can create another twitch account for bot and use its token instead
* `twitchChannelName` - your twitch channel name
* `prefix` - command prefix, default '!'
* `langauge` - bot language
* `debug` - if `true` console will output additional data
* `autoUpdate` - set to `false` if you want to manually update your bot
### config.json
```json
{
  "osuUsername": null, 
  "osuApiKey": null, 
  "osuIRCPassword": null, 
  "twitchBotToken": null,
  "twitchChannelName": null,
  "prefix": "!",
  "language": "en_US",
  "debug": false, 
  "autoUpdate": true 
}
```
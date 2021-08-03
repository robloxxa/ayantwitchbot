# Ayan Twitch bot
Бот для обработки команд/ссылок связанных с osu! из вашего чата twitch написанный на Node JS
## Установка
1. Скачайте Бота ( [Windows]() | [Linux]() )
2. Скачайте [gosumemory](https://github.com/l3lackShark/gosumemory)
3. Запустите osu!
4. Запустите gosumemory
5. Запустите Бота ( ayanbot.exe | sh ./ayanbot | node index.js)
>Имейте ввиду что linux билд не был протестирован и может содержать баги 
## Стандартные команды
* !np - выводит текущую карту в osu!\
![](https://i.imgur.com/h11lplS.png)
* !currentskin - выводит текущий скин\
![](https://i.imgur.com/FQF8hyu.png)
* !pp `accuracy` `combo` `mods` `misses` - выводит количество pp за текущую карту в osu!\
![](https://i.imgur.com/tWvCToL.png)
* \*osu! beatmap link\* - выводит информацию о карте и отправляет её в личные сообщения osu!
![](https://i.imgur.com/9U96S1V.png)
![](https://i.imgur.com/JWBnvTt.png)
* \*osu! profile link\* - выводит информацию о пользователе в чат Twitch
![](https://i.imgur.com/oMnI2k5.png)
>*Для работы команд !np, !currentskin и !pp требуется **[gosumemory](https://github.com/l3lackShark/gosumemory)***

>*Все .js файлы этих команд хранятся в папке **/commands/defaultCommands** вместе с исполняемым файлом*
## Создание собственных команд
Вы можете создавать собственные команды с помощью javascript и использовать их в боте

Скрипт должен находится в папке **/commands/** которая лежит рядом с исполнительным файлом
>Если вы хотите импортировать дополнительные файлы (Скрипт, json или Node JS Аддон (.module)), то можно создать отдельную папку для команды
### Пример 
```javascript
exports.conf = { // Настройки названия, алиасов и регулярных выражений команды
      name: 'currentskin',
      aliases: ['cs', 'skincurrent'],
      modOnly: false,
      regexp: { // Если вам не нужно регулярное выражение вы можете удалить этот объект
          only: false, // Если true то команда будет вызыватся только по регулярному выражению игнорируя название
          value: '/skin?/g'
      }
  }
  
  exports.run = async (client, channel, author, value) => {
      const data = await client.gosu.data() // получаем данные с gosumemory (./api/gosu.js)
      if (!data) return  // Если данных нет - выходим.
      client.twitch.say(channel, `Current skin: ${data.settings.folders.skin}`) 
 }
```
### Импортирование файлов в папке со скриптом
Если вы хотите импортировать дополнительные файлы находящийся в папке с командой то вы должны указывать путь так:
```javascript
const myAnotherScript = require(process.cwd()+'//anotherscript.js')
const myJson = require(process.cwd()+'//myJson.json')
const fs = require('fs') // Вы так же можете импортировать модули которые доступны в проекте
```
## Конфиг
Все данные введенные при первом запуске программы хранятся config.json рядом с исполнительным файлом\
```json
{
  // Ваш логин osu! Нужен для подключения к чату (реквесты)
  "osuUsername": null, 
  // Апи ключ нужен для получения данных карты и пользователя
  // https://osu.ppy.sh/p/api
  "osuApiKey": null, 
  // Ваш osu! IRC пароль. Нужен для подключения к чату (реквесты)
  // https://osu.ppy.sh/p/irc
  "osuIRCPassword": null, 
  // Twitch TMI токен. Можно создать отдельный аккаунт Twitch для бота и использовать его токен
  "twitchBotToken": null,
  "twitchChannelName": null,
  "prefix": "!",
  "language": "en_US",
  // Если true консоль выводит дополнительные данные
  "debug": false, 
  // Замените на false если не хотите чтобы бот автоматически скачивал новый релиз с гитхаба
  "autoUpdate": true 
}
```
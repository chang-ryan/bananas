const Discord = require('discord.js')
const config = require('./config.json')

const bot = new Discord.Client({})

bot.on('ready', () => {
  console.log(`Bot has started, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} guilds.`)

  // bot.user.setActivity(`Serving ${bot.guilds.size} servers.`)
})

bot.on('message', async (message) => {
  if (message.author.bot) return

  const messageContentArray = message.content.split(' ')
  const prefix = messageContentArray[0]
  const command = messageContentArray[1]

  if (prefix !== config.prefix) return

  if (command === 'ping') {
    const m = await message.channel.send('Ping?')
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms.`)
  }
})

bot.login(config.token)

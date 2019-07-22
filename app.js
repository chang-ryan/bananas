require('dotenv').config()

const Discord = require('discord.js')
const config = require('./config.json')

const bot = new Discord.Client({})

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`)
  console.log(`Bot has started, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} guilds.`)

  bot.user.setActivity(`Serving ${bot.guilds.size} servers.`)
})

bot.on('message', async (message) => {
  if (message.author.bot) return

  const messageContentArray = message.content.split(' ')
  const prefix = messageContentArray[0]
  const command = messageContentArray[1]

  if (!config.prefixes.includes(prefix)) return
  if (!command) {
    return message.channel.send('Did you need help? Use `!bananas help` to show what I can do.')
  }

  if (command === 'ping') {
    const m = await message.channel.send('Ping?')
    return m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms.`)
  }

  if (command === 'enter' || command === 'ent') {
    const direction = messageContentArray[2]
    const entry = messageContentArray[3]

    const position = {
      direction,
      entry
    }

    console.log(position)

    // Store position into DB under the user that sent it.

    return message.channel.send(`${message.author.username}, you're position has been entered. May the odds be ever in your favor.`)
  }

  if (command === 'positions' || command === 'position' || command === 'pos' || command === 'p') {
    // Get all positions out of DB for current guild. Pretty display that shit.
    return message.channel.send('Positions')
  }
})

bot.login(process.env.TOKEN)

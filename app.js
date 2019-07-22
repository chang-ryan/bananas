import Discord from 'discord.js'
import Enmap from 'enmap'
import { stripIndent } from 'common-tags'
import 'dotenv/config'
import config from './config.json'

const bot = new Discord.Client({})
const board = new Enmap({ name: 'board' })

const LONG = 'long'
const SHORT = 'short'
const FLAT = 'flat'

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

  if (command === 'help' || command === 'h') {
    return message.channel.send(stripIndent`
      Howdy. This bot's prefix is \`!bananas\` or \`!bnns\`.

      Commands you can use:

      Enter: log yourself into a position.
        \`enter\`, \`ent\`: \`!bananas enter <direction> <entry>\`, i.e. \`!bananas enter long 10000\`

      Exit: remove yourself from a position.
        \`exit\`, \`ex\`: \`!bananas exit\`

      Positions: show all positions from your friends.
        \`positions\`, \`position\`, \`pos\`, \`p\`: \`!bananas positions\`
    `)
  }

  if (command === 'enter' || command === 'ent') {
    const DIRECTIONS = [LONG, SHORT]

    const direction = messageContentArray[2]
    const entry = messageContentArray[3]

    if (!direction || !entry) {
      return message.channel.send('Entry formatted incorrectly. Use `!bananas enter long 9000` to enter your position.')
    }

    if (!DIRECTIONS.includes(direction.toLowerCase())) {
      return message.channel.send('Usable directions are `long` and `short`.')
    }

    const position = {
      name: message.author.username,
      direction,
      entry
    }

    console.log(position)

    board.ensure(message.guild.id, {})
    board.set(message.guild.id, position, message.author.id)

    return message.channel.send(`${message.author.username}, you're position has been entered. May the odds be ever in your favor.`)
  }

  if (command === 'exit' || command === 'ex') {
    const position = {
      name: message.author.username,
      direction: FLAT
    }

    board.set(message.guild.id, position, message.author.id)

    return message.channel.send(`${message.author.username}, you have exited your position.`)
  }

  if (command === 'positions' || command === 'position' || command === 'pos' || command === 'p') {
    const positions = board.get(message.guild.id)
    const messages = Object.keys(positions).map((userId) => {
      if (positions[userId].direction === FLAT) {
        return `_${positions[userId].name}_ is ${FLAT} like our planet.`
      }

      return `_${positions[userId].name}_ is ${positions[userId].direction} from ${positions[userId].entry}.`
    })

    const response = messages.join('\n')

    console.log(response)
    return message.channel.send(response)
  }
})

bot.login(process.env.TOKEN)

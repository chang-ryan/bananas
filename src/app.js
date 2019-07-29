import 'dotenv/config'
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Discord from 'discord.js'
import Enmap from 'enmap'
import axios from 'axios'
import { stripIndent } from 'common-tags'
import { get, isEmpty } from 'lodash'
import { LONG, SHORT, FLAT, PREFIXES } from './constants'

const bot = new Discord.Client({})
const board = new Enmap({ name: 'board' })

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`)
  console.log(`Bot has started, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} guilds.`)

  bot.user.setActivity(`Eating bananas in ${bot.guilds.size} servers.`)
})

bot.on('message', async (message) => {
  if (message.author.bot) return

  const messageContentArray = message.content.split(' ')
  const prefix = messageContentArray[0]
  const command = messageContentArray[1]

  if (!PREFIXES.includes(prefix)) return
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
      return message.channel.send('Entry formatted incorrectly. Use `!bananas enter <direction> <entry>` to enter your position.')
    }

    if (!DIRECTIONS.includes(direction.toLowerCase())) {
      return message.channel.send('Usable directions are `long` and `short`.')
    }

    const position = {
      name: message.author.username,
      direction,
      entry,
      position: `${direction === SHORT ? '-' : ''}${entry}`
    }

    board.ensure(message.guild.id, {})
    board.set(message.guild.id, position, message.author.id)

    return message.channel.send(`_${message.author.username}_, your position has been entered. May the odds be ever in your favor.`)
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
    const bitcoinPriceIndexResponse = await axios.get('https://api.coindesk.com/v1/bpi/currentprice.json')
    let bitcoinPriceIndex = get(bitcoinPriceIndexResponse, 'data.bpi.USD.rate')

    if (bitcoinPriceIndex) {
      bitcoinPriceIndex = Number(bitcoinPriceIndex.replace(',', '')).toFixed(2)
    }

    const positions = board.get(message.guild.id)

    if (isEmpty(positions)) {
      return message.channel.send('No positions assigned. Use `!bananas help` to find out how!')
    }

    const messages = Object.keys(positions).map((userId) => {
      const { name, direction, entry } = positions[userId]

      if (direction === FLAT) {
        return `_${name}_ is ${FLAT} like our planet.`
      }

      let openPnl
      let directionIcon

      if (direction === LONG) {
        openPnl = bitcoinPriceIndex - Number(entry)
        directionIcon = '🚀'
      }
      if (direction === SHORT) {
        openPnl = Number(entry) - bitcoinPriceIndex
        directionIcon = '💩'
      }

      if (bitcoinPriceIndex) {
        return `${directionIcon} _${name}_ is ${direction} from ${entry} for an open PNL of ${openPnl.toFixed(2)} points.`
      }

      return `${directionIcon} _${name}_ is ${direction} from ${entry}.`
    })

    if (bitcoinPriceIndex) {
      messages.unshift(`\`BTCUSD ${bitcoinPriceIndex}\`\n`)
    }

    const response = messages.join('\n')

    return message.channel.send(response)
  }
})

bot.login(process.env.TOKEN)

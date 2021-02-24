const { Client, Collection } = require("discord.js")
const { config } = require("dotenv")
const fs = require("fs")

config({
	path: ".env"
})

const client = new Client({
	disableEveryone: true
})

client.commands = new Collection()
client.aliases = new Collection()
client.dm = new Collection()

require(`./handler.js`)(client)

client.on("ready", () => {
	if (!fs.existsSync("./_files/")) fs.mkdirSync("./_files")
	if (!fs.existsSync("./_files/channels.json")) fs.writeFileSync("./_files/channels.json", "{}")

	console.log(`logged in as ${client.user.tag}.`)

	client.user.setPresence({
		status: "dnd",
		activity: {
			name: "!help",
			type: "PLAYING"
		}
	})
})

client.on("message", async  message => {
	if (message.author.bot) return
	if (!message.content) return

	channel_name = (message.channel.type == "dm") ? `{${message.channel.recipient.username}}` : `[${message.guild.name}] (${message.channel.name})`
	console.log(`${channel_name} ${message.author.username}: ${message.content}`)

	const prefix = "<"

	if (message.author.bot) return
	if (!message.content.startsWith(prefix)) return
	if (!message.member && message.guild) message.member = await message.guild.fetchMember(message)

	const args = message.content.slice(prefix.length).trim().split(/ +/g)

	let cmd = args.shift().toLowerCase()
	if (!cmd) return

	let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd))
	if (!command) return

	if (!message.guild && !client.dm.get(cmd)) return
	if (message.guild && client.dm.get(cmd)) return

	try {
		command.run(client, message, args)
	} catch (error) {
		console.log(error)
	}
})

client.login(process.env.TOKEN)

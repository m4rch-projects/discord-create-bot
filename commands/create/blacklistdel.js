const core = require("../../functions.js")
const fs = require("fs")

module.exports = {
	name: "blacklistdel",
	aliases: ["delblacklist", "blacklistremove", "removeblacklist"],
	dm: true,
	run: (client, message, args) => {
		let channels = core.cleanup(client)

		if (args.length < 2) return message.author.send("missing arguments beep boop.") //TODO
		if (!core.get_calls().includes(args[0])) return message.author.send("there is no channel associated with this key.")

		let key = args.shift()
		let index = core.get_index(key)
		if (!index) return message.author.send("there is no channel associated with this key.")

		let channel = channels[index[0]][index[1]]
		if (channel.owner != message.author.id) return message.author.send("you don't own the channel associated with this key.")

		args = args.filter((item, index) => {return index === args.indexOf(item)})

		args.forEach(user => {
			let id
			client.guilds.cache.get(index[0]).members.cache.forEach(member => {if (member.user.tag == user) id = member.user.id})
			if (!id) return message.author.send(`user ${user} does not exist.`), args = args.filter(item => item != user)
			if (!channel["blacklist"].includes(id)) return message.author.send(`user ${user} not on blacklist.`), args = args.filter(item => item != user) //TODO

			channel.blacklist = channel.blacklist.filter(item => item != id)
		})

		message.author.send(`successfully removed ${args.join(", ")} from blacklist.`)
		channels[index[0]][index[1]] = channel
		fs.writeFileSync("./_files/channels.json", JSON.stringify(channels, null, "\t"))
	}
}

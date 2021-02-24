const core = require("../../functions.js")
const fs = require("fs")

module.exports = {
	name: "adduser",
	aliases: ["addmember"],
	dm: true,
	run: (client, message, args) => {
		let channels = core.cleanup(client)

		if (args.length < 2) return message.author.send("missing arguments beep boop.") //TODO
		if (!core.get_calls().includes(args[0])) return message.author.send("there is no channel associated with this key.")

		let key = args.shift()
		let index = core.get_index(key)
		if (!index) return message.author.send("there is no channel associated with this key.")

		args = args.filter((item, index) => {return index === args.indexOf(item)})

		let channel = channels[index[0]][index[1]]
		if (channel["owner"] != message.author.id) return message.author.send("you don't own the channel associated with this key.")

		args.forEach(user => {
			let id
			client.guilds.cache.get(index[0]).members.cache.forEach(member => {if (member.user.tag == user) id = member.user.id})
			if (!id) return message.author.send(`user ${user} does not exist.`), args = args.filter(item => item != user) //TODO
			if (channel["member"].includes(id)) return message.author.send(`user ${user} already on whitelist.`), args = args.filter(item => item != user) //TODO
			if (channel["blacklist"].includes(id)) return message.author.send(`user ${user} on blacklist.`), args = args.filter(item => item != user) //TODO

			try {
				client.guilds.cache.get(index[0]).members.cache.get(id).roles.add(channel["role"])
				channel["member"].push(id)
			} catch {
				return message.author.send(`role not there or something.`) //TODO
			}
		})

		message.author.send(`successfully added ${args.join(", ")} to whitelist`) //TODO
		channels[index[0]][index[1]] = channel
		fs.writeFileSync("./_files/channels.json", JSON.stringify(channels, null, "\t"))
	}
}

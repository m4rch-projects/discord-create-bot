const core = require("../../functions.js")
const fs = require("fs")

module.exports = {
	name: "blacklistadd",
	aliases: ["addblacklist"],
	dm: true,
	run: (client, message, args) => {
		let channels = core.cleanup(client)

		if (args.length < 2) return message.author.send("you have to give me at least 2 arguments: the key of the channel and at minimum 1 user.")

		let key = args.shift()
		if (!core.get_calls().includes(key)) return message.author.send("there is no channel associated with this key.")

		let index = core.get_index(key)
		if (!index) return message.author.send("there is no channel associated with this key.")

		let channel = channels[index[0]][index[1]]
		if (channel["owner"] != message.author.id) return message.author.send("you don't own the channel associated with this key.")

		args.forEach(user => {
			let id
			client.guilds.cache.get(index[0]).members.cache.forEach(member => {if (member.user.tag == user) id = member.user.id})
			if (!id) return message.author.send(`user ${user} does not exist.`), args = args.filter(item => item != user) //TODO

			if (channel.member.includes(id)) {
				channel.member = channel.member.filter(item => item != id)
				try {
					client.guilds.cache.get(index[0]).members.cache.get(id).roles.remove(channel["role"])
				} catch {
					console.error()
				}
			}
			if (channel["blacklist"].includes(id)) return message.author.send(`user ${user} already on blacklist.`), args = args.filter(item => item != user) // TODO
			channel["blacklist"].push(id)
		})

		message.author.send(`successfully added ${args.join(", ")} to blacklist`) //TODO
		channels[index[0]][index[1]] = channel
		fs.writeFileSync("./_files/channels.json", JSON.stringify(channels, null, "\t"))
	}
}
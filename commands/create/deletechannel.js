const core = require("../../functions.js")
const fs = require("fs")

module.exports = {
	name: "deletechannel",
	aliases: ["delchannel", "channeldelete", "channeldel"],
	dm: true,
	run: async (client, message, args) => {
		channels = JSON.parse(fs.readFileSync("./_files/channels.json"))

		if (!args[0]) return message.author.send("no arguments given.")
		if (!core.get_calls().includes(args[0])) return message.author.send("key not linked to channel.")

		for (guild in channels) {
			for (index in channels[guild]) {
				if (channels[guild][index].call == args[0]) {
					if (channels[guild][index]["owner"] != message.author.id) return message.author.send("you dont own that channel")
					let channel = client.guilds.cache.get(guild).channels.cache.get(channels[guild][index]["id"])
					if (channel) channel.delete()
					delete channels[guild][index]
				}
			}
			channels[guild] = channels[guild].filter(item => item)
		}

		message.author.send(`successfuly deleted channel.`) //TODO

		fs.writeFileSync("./_files/channels.json", JSON.stringify(channels, null, "\t"))
	}
}

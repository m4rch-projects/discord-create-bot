const core = require("../../functions.js")
const fs = require("fs")

module.exports = {
	name: "joined",
	dm: true,
	run: (client, message, args) => {
		let channels = core.cleanup(client)

		let msg = ""
		let joinedguild = []
		for (let guild in channels) {
			channels[guild].forEach(channel => {
				if (channel["member"].includes(message.author.id)) {
					if (!joinedguild.includes(guild)) {
						joinedguild.push(guild)
						msg += `${client.guilds.cache.get(guild).name}:\n\t-\tname: ${client.guilds.cache.get(guild).channels.cache.get(channel["id"]).name}\n\t-\tkey: ${channel["call"]}`
					} else {
						msg += `\n\t~ ~ ~\n\t-\tname: ${client.guilds.cache.get(guild).channels.cache.get(channel["id"]).name}\n\t-\tkey: ${channel["call"]}`
					}
				}
			})
			if (joinedguild.includes(guild)) msg += "\n\n"
		}

		if (!msg) return message.author.send("you currently are not on any channel.")
		msg = "channels:\n" + msg
		message.author.send(msg)
	}
}

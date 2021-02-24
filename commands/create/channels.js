const core = require("../../functions.js")
const fs = require("fs")

module.exports = {
	name: "channels",
	aliases: ["created"],
	dm: true,
	run: (client, message, args) => {
		console.log("test")

		let channels = core.cleanup(client)

		let msg = ""

		for (guild in channels) {
			channels[guild].forEach(channel => {
				if (channel.owner == message.author.id) {
					let member = []
					let blacklist = []
					channel.blacklist.forEach(id => {
						if (client.guilds.cache.get(guild).members.cache.get(id)) blacklist.push(client.guilds.cache.get(guild).members.cache.get(id))
					})
					channel-member.forEach(id => {
						if (client.guilds.cache.get(guild).members.cache.get(id)) member.push(client.guilds.cache.get(guild).members.cache.get(id))
					})
					msg += `${client.guilds.cache.get(guild).name}:\n\t-\tname: ${client.guilds.cache.get(guild).channels.cache.get(channel["id"]).name}\n\t-\tkey: ${channel.call}\n\t-\tblacklist: [ ${blacklist.join(",")} ]\n\t-\tmembers: [ ${member.join(", ")} ]\n`
				}
			})
		}

		if (!msg) return message.author.send("you dont currently own any channel.")
		msg = "channels:\n" + msg
		message.author.send(msg)
	}
}

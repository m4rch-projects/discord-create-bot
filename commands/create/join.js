const fs = require("fs")
const core = require("../../functions.js")

module.exports = {
	name: "join",
	dm: true,
	run: (client, message, args) => {
		let channels = core.cleanup(client)

		if (!args.length) return message.author.send("missing arguments...") //TODO
		if (!args.length > 2) return message.author.send("too many arguments...") //TODO

		if (!core.get_calls().includes(args[0])) return message.author.send("not a channel.") //TODO

		let index = core.get_index(args[0])
		if (!index) return message.author.send("not a channel.") //TODO

		if (channels[index[0]][index[1]]["owner"] == message.author.id) return message.author.send("this channel belongs to you.")
		if (channels[index[0]][index[1]]["blacklist"].includes(message.author.id)) return message.author.send("you are on the blacklist of this channel, message the creator of the channel if you want to know the reasons.")
		if (channels[index[0]][index[1]]["member"].includes(message.author.id)) return message.author.send("you already joined this channel.")

		if (channels[index[0]][index[1]]["password"]) {
			if (args.length != 2) return message.author.send("no password given...") //TODO
			if (args[1] != channels[index[0]][index[1]]["password"]) return message.author.send("passwords don't match...") //TODO

			client.guilds.cache.get(index[0]).members.cache.get(message.author.id).roles.add(channels[index[0]][index[1]]["role"])
			channels[index[0]][index[1]]["member"].push(message.author.id)
		} else {
			client.guilds.cache.get(index[0]).members.cache.get(message.author.id).roles.add(channels[index[0]][index[1]]["role"])
			channels[index[0]][index[1]]["member"].push(message.author.id)
		}

		message.author.send(`successfully joined channel "${client.guilds.cache.get(index[0]).channels.cache.get(channels[index[0]][index[1]]["id"]).name}" on server "${client.guilds.cache.get(index[0]).name}".`)
		fs.writeFileSync("./_files/channels.json", JSON.stringify(channels, null, "\t"))
	}
}
const fs = require("fs")
const core = require("../../functions.js")

module.exports = {
	name: "leave",
	aliases: ["unjoin"],
	dm: true,
	run: (client, message, args) => {
		let channels = core.cleanup(client)
		
		if (!args.length) return message.author.send("missing arguments...") //TODO
		if (!args.length > 1) return message.author.send("too many arguments...") //TODO
		
		if (!core.get_calls().includes(args[0])) return message.author.send("not a channel.") //TODO
		
		let index = core.get_index(args[0])
		if (!index) return message.author.send("not a channel.") //TODO

		if (!channels[index[0]][index[1]]["member"].includes(message.author.id)) return message.author.send("not on channel.") //TODO

		try {
			client.guilds.cache.get(index[0]).members.cache.get(message.author.id).roles.remove(channels[index[0]][index[1]]["role"])
			channels[index[0]][index[1]]["member"] = channels[index[0]][index[1]]["member"].filter(user => user != message.author.id)
		} catch {

		}

		message.author.send(`successfully left channel "${client.guilds.cache.get(index[0]).channels.cache.get(channels[index[0]][index[1]]["id"]).name}" of server "${client.guilds.cache.get(index[0]).name}"`)
		fs.writeFileSync("./_files/channels.json", JSON.stringify(channels, null, "\t"))
	}
}

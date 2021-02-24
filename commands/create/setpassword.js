const fs = require("fs")
const core = require("../../functions.js")

module.exports = {
	name: "setpassword",
	aliases: ["changepassword"],
	dm: true,
	run: (client, message, args) => {
		let channels = core.cleanup(client)

		if (args.length != 2) return message.author.send("you have to give me two arguments: the key of the channel and the new password.")

		if (!core.get_calls().includes(args[0])) return message.author.send("there is no channel associated with this key.")

		let index = core.get_index(args[0])
		if (!index) return message.author.send("there is no channel associated with this key.")

		channels[index[0]][index[1]]["password"] = args[1]

		message.author.send(`changed password of channel "${client.guilds.cache.get(index[0]).channels.cache.get(channels[index[0]][index[1]]["id"]).name}"`)
		fs.writeFileSync("./_files/channels.json", JSON.stringify(channels, null, "\t"))
	}
}

const core = require("../../functions.js")
const fs = require("fs")

module.exports = {
	name: "changename",
	aliases: ["editname"],
	dm: true,
	run: (client, message, args) => {
		let channels = core.cleanup(client)

		if (args.length < 2) return message.author.send("you have to give me 2 arguments: the key of the channel and the new name.")

		key = args.shift()
		args = args.join(" ")
		if (!core.get_calls().includes(key)) return message.author.send("there is no channel associated with this key.")

		if (args.length > 100) return message.author.send(`the new name of your channel is with ${args.length} characters ${args.length - 100} characters to long for the maximum limit of 100.`)
		let index = core.get_index(key)
		if (!index) return message.author.send("there is no channel associated with this key.")

		client.guilds.cache.get(index[0]).channels.cache.get(channels[index[0]][index[1]]["id"]).edit({name: args})

		message.author.send(`channel name changed to \"${args}\".`)
	}
}

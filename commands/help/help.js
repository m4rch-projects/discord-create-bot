const fs = require("fs")

module.exports = {
	name: "help",
	dm: true,
	run: async (client, message, args) => {
		let msg = "commands:\n"

		fs.readdirSync("./commands/").forEach(category => {
			msg += `--${category}--`
			msg += "\n"
 
			let commands = fs.readdirSync(`./commands/${category}/`)

			for (let file of commands) {
				let pull = require(`../../commands/${category}/${file}`)

				if (pull.name) {
					msg += "\t-\t"
					msg += pull.name

					if (pull.dm) {
						msg += " [dm-command]\n"
					} else {
						msg += " [server-command]\n"
					}
				}
			}
			
			msg += "\n\n"
		})
		
		message.author.send(msg)
	}
}

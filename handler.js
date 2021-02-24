const fs = require("fs")
const ascii = require("ascii-table")

module.exports = (client) => {
	let table = new ascii("Commands")
	table.setHeading("Command", "Category", "Status")

	fs.readdirSync("./commands/").forEach(dir => {

		const commands = fs.readdirSync(`./commands/${dir}/`).filter(file => file.endsWith(".js"))

		commands.forEach(file => {
			let pull = require(`./commands/${dir}/${file}`)

			if (!pull.name || typeof pull.run != "function") return table.addRow(file, dir, `❌`)

			client.commands.set(pull.name, pull)
			table.addRow(file, dir, "✅")
			
			if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name))

			client.dm.set(pull.name, pull.dm)
		})

	})

	console.log(table.toString())
}

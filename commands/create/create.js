const core = require("../../functions.js")
const fs = require("fs")

module.exports = {
	name: "create",
	description: "",
	dm: false,
	run: async (client, message, args) => {
		let channels = core.cleanup(client)
		message.delete()

		if (!args[0]) return message.member.send("you have to give the channel a name")
		if (core.getOwners(message.guild.id).includes(message.member.user.id)) return message.member.send("you already own a channel. write !help to get the commands to edit your channel or !deletechannel to delete it.")

		let channel
		message.guild.channels.create(args[0], {
			"type": "voice",
			"parent": core.get_category(message.guild),
			"permissionOverwrites": [
				{
					"id": core.get_everyone(message),
					"deny": ["VIEW_CHANNEL"],
				}
			]
		})
		.then(c => {channel = c})
		.then(_ => {
			message.guild.roles.create({
				"data": {
					"name": channel.id
				},
			})
			.then(rl => { message.member.roles.add(rl.id), role = rl })
			.then(_ => { channel.edit(
				{
					"permissionOverwrites": [
						{
							"id": core.get_everyone(message),
							"deny": ["VIEW_CHANNEL"],
						},
						{
							"id": role.id,
							"allow": ["VIEW_CHANNEL"]
						}
					]
				}
			)})
			.then(_ => {
				if (!channels[message.guild.id]) channels[message.guild.id] = []

				temp_dict = {
					id: channel.id,
					role: role.id,
					server: channel.guild.id,
					owner: message.member.user.id,
					call: core.generate_call(),
					password: null,
					blacklist: [],
					member: [],
				}

				channels[message.guild.id].push(temp_dict)

				message.member.send(`you have created a voice channel, its key is "${temp_dict["call"]}"\nit currently has no password, meaning everyone can join if they have the key of your channel, but you can change that with command "!setpassword"\nyou can also add, remove or blacklist users.\nto see the full list of commands use "!help"`) //TODO

				fs.writeFileSync("./_files/channels.json", JSON.stringify(channels, null, "\t"))
			})
			.catch(console.error)
		})
		.catch(console.error)
	}
}

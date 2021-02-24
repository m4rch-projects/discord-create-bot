const core = require("./functions.js")
const fs = require("fs")

exports.getOwners = function (id) {
	let channels = JSON.parse(fs.readFileSync("./_files/channels.json"))
	
	if (!channels[id]) return []
	channels = channels[id]
	let owners = []

	channels.forEach(channel => { 
		if (channel["owner"]) {
			owners.push(channel["owner"])
		} else {
			console.log("error: no owner in:", channel)
		}
	})

	return owners
}

exports.get_values = function(array, key) {
	let temp = []

	array.forEach(element => {
		if (element[key]) {
			temp.push(element[key])
		} else {
			throw new Error(`no key ${key} in element ${element}`)
		}
	})

	return temp
}

exports.cleanup = function (client) {
	//half done
	let channels = JSON.parse(fs.readFileSync("./_files/channels.json"))

	for (x in channels) {
		if (!client.guilds.cache.get(x)) {
			delete channels[x]
			continue
		}
		for (i in channels[x]) {
			if (!client.guilds.cache.get(x).members.cache.get(channels[x][i].owner)){
				delete channels[x][i]
			}
		}
	channels[x] = channels[x].filter(item => item)
	}

	fs.writeFileSync("./_files/channels.json", JSON.stringify(channels, null, "\t"))
}

exports.get_category = function (guild) {
	let id = null

	guild.channels.cache.forEach(channel => {
		if (channel.name == "custom" && channel.type == "category") id = channel.id
	})

	return id
}

exports.generate_call = function () {
	let calls = core.get_calls()
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@$%&"
	let call = []
	
	for (i = 0; i < 8; i++) {
		call.push(characters[Math.floor(Math.random() * characters.length)])
	}
	if (calls.includes(call)) return core.generate_call()

	return call.join("")
}

exports.get_calls = function () {
	let channels = JSON.parse(fs.readFileSync("./_files/channels.json"))
	let calls = []

	for (x in channels) {
		channels[x].forEach(channel => { 
			if (channel["call"]) {
				calls.push(channel["call"])
			} else {
				console.log("error: no owner in:", channel)
			}
		})
	}

	return calls
}

exports.get_everyone = function (message) {
	let id_ev
	message.guild.roles.cache.forEach(role => {
		if (role.name == "@everyone") {
			if (role.rawPosition == 0) {
				id_ev = role.id
			}
		}
	})
	return id_ev
}

exports.cleanup = function (client) {
	let channels = JSON.parse(fs.readFileSync("./_files/channels.json"))
		
	for (x in channels) {
		if (!client.guilds.cache.get(x)) {
			delete channels[x]
			continue
		}
		for (i in channels[x]) {
			if (!client.guilds.cache.get(x).members.cache.get(channels[x][i].owner)){
				let channel = client.guilds.cache.get(x).channels.cache.get(channels[x][i]["id"])
				if (channel) channel.delete()
				delete channels[x][i]
			}
		}
	channels[x] = channels[x].filter(item => item)
	}

	fs.writeFileSync("./_files/channels.json", JSON.stringify(channels, null, "\t"))
	return channels
}

exports.get_index = function (key) {
	let channels = JSON.parse(fs.readFileSync("./_files/channels.json"))

	for (let guild in channels) {
		for (let channel in channels[guild]) {
			if (channels[guild][channel]["call"] == key) return [guild, channel]
		}
	}

	return null
}

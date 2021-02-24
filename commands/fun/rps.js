module.exports = {
	name: "rps",
	dm: false,
	run: (client, message, args) => {
		values = ["rock", "paper", "scissors"]

		if (!args[0]) return message.channel.send("error: no arguments.") //TODO
		if (!values.includes(args[0].toLowerCase())) return message.channel.send(`error: invalid argument: ${args[0]}.`) //TODO

		let op = values[Math.floor(Math.random() * values.length)]

		switch (args[0].toLowerCase()) {
			case "rock":
				switch (op) {
					case "rock":
						message.channel.send("draw!") //TODO
						break
					case "paper":
						message.channel.send("you lost!") //TODO
						break
					case "scissors":
						message.channel.send("you won!") //TODO
						break
				}
				break
			case "paper":
				switch (op) {
					case "rock":
						message.channel.send("you won!") //TODO
						break
					case "paper":
						message.channel.send("draw!") //TODO
						break
					case "scissors":
						message.channel.send("you lost!") //TODO
						break
				}
				break
			case "scissors":
				switch (op) {
					case "rock":
						message.channel.send("you lost!") //TODO
						break
					case "paper":
						message.channel.send("you won!") //TODO
						break
					case "scissors":
						message.channel.send("draw!") //TODO
						break
				}
				break
		}
	}
}
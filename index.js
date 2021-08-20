const Discord = require("discord.js");
const mcrcon = require("minecraft-server-util");
require('dotenv').config()

const client = new Discord.Client()
const rcon = new mcrcon.RCON(process.env.HOST, { port: 25575, enableSRV: true, timeout: 5000, password: process.env.RCON_PASS }); // These are the default options



rcon.on('output', (message) => {
    // The client must be closed AFTER receiving the message.
    // Closing too early will cause the client to never output
    // any message.
    rcon.close();
});

client.on("message", async (msg) => {
	if (msg.content[0] == "/") {
		const args = msg.content.substring(1).split(" ")
		if (cmd[args[0]]) {
			let funcname = args.shift().toLowerCase()
			await cmd[funcname](msg, args)
			console.log("Message command " + args[0])
		}
	}
	if (msg.channel == "834962658494775306" && !msg.author.bot) {
		rcon.connect()
			.then(() => rcon.run(`tellraw @a {"text":"[Discord] ${msg.author.username}: ${msg.content}","color":"light_purple"}`)) // List all players online
			.catch((error) => {
				console.error(error);
			});
	}
	
})

client.on("ready", () => {
	console.log("hi")
})


client.login(process.env.TOKEN)
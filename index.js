const Discord = require("discord.js");
const mcrcon = require("minecraft-server-util");
const cache = require("./star.json");
const fs = require('fs');
require('dotenv').config()
const client = new Discord.Client()
const rcon = new mcrcon.RCON(process.env.HOST, { port: 25575, enableSRV: true, timeout: 5000, password: process.env.RCON_PASS }); // These are the default options

const unstarable_channels = ["880995806251991110", "840590757555339276", "840590726512640032", "840590695755415572", "840590481288200212", "816031441250156565"]

client.on("messageReactionAdd", async (reaction, user) => {
	if (!user.bot) {
		const msg = reaction.message;
		msg.reactions.cache.map(messagereaction => {
			if (messagereaction.count == 6 && (messagereaction.emoji instanceof Discord.GuildEmoji) && !cache.includes(msg.id) && !unstarable_channels.includes(msg.channel.id)) {
				// handle posting to highlight channel
				const content = msg.attachments.map(attach => (attach.url));
				const embed = new Discord.MessageEmbed()
					.setTitle("Click to jump")
					.setDescription(msg.content)
					.setAuthor(name=msg.author.username,iconURL=msg.author.avatarURL(),url=msg.url)
					.setTimestamp(msg.createdAt)
					.setColor("#f5ad42")
					.setURL(url=msg.url)
				//client.channels.
				client.guilds.fetch("598596152690081806").then(marisad => {
					marisad.channels.cache.get("880995806251991110").send({embed:embed, files:content})//["880995806251991110"].send(content, embed)
				});
				cache.push(msg.id);
				fs.writeFileSync("./star.json", JSON.stringify(cache));
			}
		})
	}
})

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
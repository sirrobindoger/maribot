//import {Rcon} from "rcon-client";
// MODULES
//const {Rcon} = require("rcon-client")
import {Rcon} from "rcon-client";
import Discord from "discord.js";
import fs from "fs";
// Configs
import cfg from './dat/config.json';
import whitelist from './dat/whitelist.json';


const client = new Discord.Client()
const rcon = new Rcon({
	host:cfg.host,
	port:25575,
	password:cfg.rconpass
})

const updateWhitelist = () => {
	fs.writeFile('./dat/whitelist.json', JSON.stringify(whitelist), function writeJSON(err) {
		if (err) return console.log(err);
		//console.log('writing to ' + fName);
	});
}

const cmd = {
	"rcon": async (msg, args) => {
		console.log("111")
		let res = "";
		let color = "#1F8B4C";
		if (msg.member.permissions.has("ADMINISTRATOR")) {
			try {
				await rcon.connect()
				res = `${await rcon.send(args.join(" ")) || "Empty response"}`;
				color = "#F1C40F";
			} catch(error) {
				res = `\`\`\`Error: ${error}\`\`\``;
			} finally {
				rcon.end()
			}
		} else {
			res = "```You do not have permission for this.```";
		}
		let embed = new Discord.MessageEmbed()
			.setTitle("RCON Output")
			.setDescription(res)
			.setColor(color)
		msg.channel.send(embed);
	},
	"register": async(msg, args) => {
		if (msg.channel instanceof Discord.DMChannel) {
			if (whitelist[msg.author.id]) {
				msg.author.send(`You already have a whitelist on here! "${whitelist[msg.author.id]}"\nPlease contact a moderator to change this.`)
			} else {
				try {
					await rcon.connect()
					await rcon.send(`whitelist add ${args[0]}`)
					whitelist[msg.author.id] = args[0]
					updateWhitelist();
					await msg.author.send(`**Successfully added ${args[0]} to the whitelist.**`)
				} catch (err) {
					console.log(err)
					await msg.author.send("Couldn't update your name due to an error, please contact Sirro")
				} finally {
					rcon.end()
				}
			}
		}
	}
}

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
		try {
			await rcon.connect()
			rcon.send(`tellraw @a {"text":"[Discord] ${msg.author.username}: ${msg.content}","color":"light_purple"}`)
		} catch (e) {
			console.log(e)
		} finally {
			rcon.end()
		}
	}
	
})

client.on("ready", () => {
	console.log("hi")
})


client.login(cfg.token)
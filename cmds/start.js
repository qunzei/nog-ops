const Discord = require('discord.js');
const Listing = require('./../modules/Listing');
const fs = require('fs');
const settings = require('./../settings.json');
const owner = settings.owner;

module.exports.run = async (bot, message, args) => {
    let snipeChannel = message.channel;
    const filter = m => !m.author.bot;
    let game = new Listing();

    
    let raw = fs.readFileSync('./roles.json');
    let allowedRoles = JSON.parse(raw);

    let validation = function(serverRoles, userRoles){
        let val = false;
        serverRoles.forEach((role) => {
            userRoles.forEach((usr) => {
                if (role == usr){
                    val = true;
                }
            });
        });
        return val;
    }
    

    let editLast3 = null;

    let info = new Discord.RichEmbed()
        .setTitle("Match Starting")
        .setDescription("A match is now starting. Follow the instructions below and any further messages that are sent by the bot or host.")     
        .setColor("#7cfc00")
        .addField("Mode", "Solos", true)
        .addField("Host", message.author, true)
        .addField("Instructions", 'A countdown will be made in the Countdown voice channel from 3, and press ready when you hear "GO!"')
        .setFooter("Developed by Qunzei")
        .setTimestamp()
    
    message.channel.send({embed: info});

    let startMessage = new Discord.RichEmbed()
        .setTitle("Waiting for codes to be posted below!")
        .setDescription("Please write the last 3 characters from your server ID. You can find this on the top left corner of your screen in-game.")
        .setColor("#00bfff")

    message.channel.send({embed: startMessage});

    let time = 25;
    let editTime = "";

    let timeEmbed = new Discord.RichEmbed()
        .setTitle("Next match is in approximately...")
        .setDescription(time + " minutes and counting.")
        .setColor("#ff00f9");

    setTimeout(async () => {
        editTime = await message.channel.send({embed: timeEmbed}).catch( (err) => {
            console.log("Can't edit deleted message.");
        });
    }, 10);

    let timeInterval = setInterval(() => {
        if (time === 1){
            time -= 1;
            timeEmbed.setDescription(time + " minutes and counting.");
            clearInterval(timeInterval);
        }else {
            time -= 1;
            timeEmbed.setDescription(time + " minutes and counting.");
        }

        editTime.edit({embed: timeEmbed}).catch((err) => {
            console.log("cant edit");
            clearInterval(timeInterval);
        });

    },60000);

    let last3 = new Discord.RichEmbed()
        .setTitle("Current Servers")
        .setColor("#ff0000");

    setTimeout(async () => {
        editLast3 = await message.channel.send({embed: last3});

        message.channel.overwritePermissions(message.guild.defaultRole, {
            SEND_MESSAGES: true
        }).catch((err) => {
            console.log(err);
        })
    }, 10);

    const collector = snipeChannel.createMessageCollector(filter, {time: 180000});

    collector.on('collect', m => {

        console.log(`Collected ${m.content} | ${m.author}`);
        
        if (validation(allowedRoles.roles,m.member.roles.array()) || m.member.id === owner){
            if (m.content === "=start" || m.content === "=stop"){
                collector.stop();
                console.log("Collector stopped");
                return;
            }
        }
        
        if (game.data.length === 0 && m.content.length === 3){
            game.addID(m.content.toUpperCase(), m.author);
        }else if (m.content.length === 3){
            if (game.userPresent(m.author)){
                game.deleteUserEntry(m.author);
                if (game.idPresent(m.content.toUpperCase())){
                    game.addUser(m.content.toUpperCase(), m.author);
                }else {
                    game.addID(m.content.toUpperCase(),m.author);
                }
            } else {
                if (game.idPresent(m.content.toUpperCase())){
                    game.addUser(m.content.toUpperCase(), m.author);
                }else {
                    game.addID(m.content.toUpperCase(), m.author);
                }
            }
        }

        game.sort();

        let str = "";
        last3 = new Discord.RichEmbed()
            .setTitle("Codes")
            .setColor("#8600b3");

        for (var i = 0; i < game.data.length; i++){
            str = "";
            for (var j = 0; j < game.data[i].users.length ; j++){
                str += game.data[i].users[j] + "\n";
            }
            last3.addField(`ID: ${game.data[i].id.toUpperCase()} - (${game.data[i].users.length} players)`, str, true);
        }
            editLast3.edit({embed: last3}).catch((err) => {
                console.log("Caught edit error");
            });

        if (m.deletable){
            m.delete().catch((err) => {
                console.log("Cant delete");
                console.log(err);
            });
        }

    });

    collector.on('end', collected => {
        console.log(`Collected ${collected.size} items`);

        let endMsg = new Discord.RichEmbed()
            .setTitle("No more codes accepted until next queue.")
            .setDescription("Good luck, and have fun!")
            .setColor("#ff0000");

        message.channel.send({embed: endMsg});

        message.channel.overwritePermissions(message.guild.defaultRole, {
            SEND_MESSAGES: false
        }).catch((err) => {
            console.log(err);
        })

    });
        

}



module.exports.help = {
    name: "start"
}
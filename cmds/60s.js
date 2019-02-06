const Discord = require('discord.js');

module.exports.run = async (bot,message,args) => {

    let sixty = new Discord.RichEmbed()
    .setTitle("Announcement")
    .setDescription("Match will begin in 1 minute.")     
    .setColor("#FF0000")
    .setTimestamp()

    message.channel.send({embed: sixty});
}

module.exports.help = {
    name: "60s"
}


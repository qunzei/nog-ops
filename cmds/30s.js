const Discord = require('discord.js');

module.exports.run = async (bot,message,args) => {

    let thirty = new Discord.RichEmbed()
    .setTitle("Announcement")
    .setDescription("Match will begin in 30 seconds.")     
    .setColor("#FF0000")
    .setTimestamp()

    message.channel.send({embed: thirty});
}

module.exports.help = {
    name: "30s"
}


const Discord = require('discord.js');
const fs = require('fs');

module.exports.run = async (bot,message,args) => {

    let raw = fs.readFileSync('./note.json');
    let notes_data = JSON.parse(raw);

    console.log(notes_data);

    let test = new Discord.RichEmbed()

    let title = notes_data.title;
    let description = notes_data.description;
    let color = notes_data.color

    if (notes_data.title != undefined){
        test.setTitle(title);
    }
    if (notes_data.description != undefined){
        test.setDescription(description);
    }
    if (notes_data.color != undefined){
        test.setColor(color);
    }

    for (var i = 0; i < notes_data.fields.length; i++){
        test.addField(notes_data.fields[i].name,notes_data.fields[i].value);
    }
    if (notes_data.footer != undefined){
        if (notes_data.footer.text != undefined){
            test.setFooter(notes_data.footer.text);
        }
    }

    message.channel.send({embed:test}).catch((err) => {
        message.channel.send("Some important fields weere left empty");
        console.log(err);
    });



}


module.exports.help = {
    name: "notes"
}

/*
A Hello
B Lolololol
D field 1
E light field 1
F #00ee00
G byebye
!done
*/
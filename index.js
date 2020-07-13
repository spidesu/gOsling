const Discord = require('discord.js')
const mongoose = require('mongoose')
const Birthday = require('./actions/birthday')
const client = new Discord.Client()
const prefix = 'g!'



async function start() {
    const url = "mongodb://localhost:27017/gosling";
    await mongoose.connect(url, {useNewUrlParser: true,useUnifiedTopology: true})
    client.login('NjcwMzE0NTQ4ODU0Nzg0MDAw.XwnA8Q.kNv3PsvZbmHtfpC5rqPpCilJhq0');
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });
  
client.on('message',async msg => {
    console.log(msg.content.substring(0,2));
    if (msg.content.substring(0,2) === prefix)
    {
        let command = msg.content.substring(2)
        let args = command.split(' ')
        let action = args.shift()
        let answer
        console.log(action)
        if (action === 'birthday') {
            let birthday = new Birthday(args, msg.guild.id,msg);
            answer = await birthday.processCommand()
            msg.reply(answer)
          }
    }
  });

start();
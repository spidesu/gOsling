require('dotenv').config()
const Discord = require('discord.js')
const mongoose = require('mongoose')
const Route = require('./src/route')
const fs = require('fs')
const util = require('util')
const Cron = require('./src/Cron/cron')
const client = new Discord.Client()
const log_error = fs.createWriteStream(__dirname + '/logs/error.log', {flags:'a'})
const prefix = 'g!'


async function start() {
    const url = process.env.MONGODB_URL
    await mongoose.connect(url, {useNewUrlParser: true,useUnifiedTopology: true})
    await client.login(process.env.TOKEN)
    let cron = new Cron(client)
    cron.start()
}

process.on('uncaughtException', (err) => {
  console.log('Caught Exception: ' + err)
  log_error.write(util.format('Caught Exception: ' + err)+ '\n')
})

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });
  
client.on('message',async msg => {
    if (msg.content.substring(0,2) === prefix)
    {
        let command = msg.content.substring(2)
        let args = command.split(/\s(?=(?:(?:[^"]*"){2})*[^"]*$)/)
        args.forEach(arg => {
          arg.replace(/"/,'')
        })
        args = args.map(arg => arg.replace(/"/g,''))
        console.log(args)
        let action = args.shift()
        let answer
        console.log(action)
        answer = await Route.process(action,msg,args)
        msg.reply(answer)        
    }
  });

start();


require('dotenv').config()
const Discord = require('discord.js')
const mongoose = require('mongoose')
const Birthday = require('./actions/birthdayAction')
const Dice = require('./actions/diceAction')
const Guild = require("./models/guild")
const tools = require("./tools")
const fs = require('fs')
const util = require('util')
const CronJob = require('cron').CronJob;
const client = new Discord.Client()
const log_error = fs.createWriteStream(__dirname + '/logs/error.log', {flags:'a'})
const prefix = 'g!'


async function start() {
    const url = process.env.MONGODB_URL
    await mongoose.connect(url, {useNewUrlParser: true,useUnifiedTopology: true})
    await client.login(process.env.TOKEN)
    let birthdayJob = new CronJob('0 0 12 * * *', tools.getTodayBirthday(client))
    birthdayJob.start()
}

process.on('uncaughtException', (err) => {
  console.log('Caught Exception: ' + err)
  log_error.write(util.format('Caught Exception: ' + err)+ '\n')
})

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });
  
client.on('message',async msg => {
    //console.log(msg.content.substring(0,2));
    if (msg.content.substring(0,2) === prefix)
    {
        let command = msg.content.substring(2)
        //let args = command.replace(/ +/g,' ').trim().split(' ')
        let args = command.split(/\s(?=(?:(?:[^"]*"){2})*[^"]*$)/)
        args.forEach(arg => {
          arg.replace(/"/,'')
        })
        args = args.map(arg => arg.replace(/"/g,''))
        console.log(args)
        let action = args.shift()
        let answer
        console.log(action)
        if (action === 'birthday') {
         
            let birthday = new Birthday(args,msg);
            answer = await birthday.processCommand()
            msg.reply(answer)
          }
        if (action === 'roll') {
         
          let dice= new Dice(args,msg);
          answer = await dice.processCommand()
          msg.reply(answer)
        }
          
    }
  });

start();


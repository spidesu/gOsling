require('dotenv').config()
const Discord = require('discord.js')
const mongoose = require('mongoose')
const schedule = require('node-schedule')
const Birthday = require('./actions/birthdayAction')
const Dice = require('./actions/diceAction')
const Guild = require("./models/guild")
const tools = require("./tools")
const fs = require('fs')
const util = require('util')
const client = new Discord.Client()
const log_error = fs.createWriteStream(__dirname + '/logs/error.log', {flags:'a'})
const prefix = 'g!'


async function start() {
    const url = process.env.MONGODB_URL
    await mongoose.connect(url, {useNewUrlParser: true,useUnifiedTopology: true})
    await client.login(process.env.TOKEN)
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

let birthdayJob = schedule.scheduleJob('* * * * *', async () => {
      let role
      let birthdayArray = []
      let guilds = await Guild.find({})
      guilds.forEach(async guild_db => {
          let messageText = "Поздравляем {message} с днём рождения! Всем по тортику!"
          let guild = await client.guilds.cache.get(guild_db.guild)
          if (!guild || !guild_db.birthdayChannel)
          {
            return;
          }
          
          let birthdayChannel = guild.channels.cache.get(guild_db.birthdayChannel)
          let birthdayMembers = await tools.getTodayBirthdays(guild_db.guild)
          if (guild_db.birthdayRole)
          {
            role = guild.roles.cache.get(guild_db.birthdayRole)
          }
          if (birthdayMembers.length > 0)
          {
            birthdayArray = []
            //console.log(birthdayMembers)
          birthdayMembers.forEach(member => {
              let guildMember = guild.members.cache.get(member.guildMemberId)
              birthdayArray.push(guildMember.toString())
              //console.log(member)
              if (typeof role !== "undefined")
              guildMember.roles.add(role)
          })
          console.log(birthdayArray)
          messageText = messageText.replace(/{message}/, birthdayArray.join(" "))
          birthdayChannel.send(messageText)
          }
      });
  })
const CronJob = require('cron').CronJob
const birthdayAction = require('./actions/birthday')
const Guild = require("./models/guild")

let birthdayJob = new CronJob ('* * * * * *', async () => {
    let birthdayArray = []
    let guilds = await Guild.find({})
    guilds.forEach(guild_db => {
        let messageText = "Поздравляем {message} с днём рождения! Всем по тортику!"
        console.log(client)
        let guild = client.guilds.cache.get(guild_db.guild)
        let birthdayChannel = guild.channels.get(guilddb.birthdayChannel)
        let birthdayMembers = birthdayAction.getTodayBirthdays(guild_db.guild)
        let role = msg.guild.roles.cache.get(guild_db.birthdayRole)

        birthdayMembers.forEach(member => {
            let guildMember = guild.members.get(member.guildMemberId)
            birthdayArray.push(guildMember.toString())
            console.log(member)
            guildMember.addRole(role)
        })
        messageText.replace(/{message}/, birthdayArray.join(" "))
        birthdayChannel.send(message)
    });
}, null, true, 'Europe/Moscow')


module.exports.birthdayJob = birthdayJob
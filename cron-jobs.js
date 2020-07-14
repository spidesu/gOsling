const CronJob = require('cron').CronJob
const birthdayAction = require('./actions/birthday')
const Guild = require("./models/guild")

let birthdayJob = new CronJob ('0 12 * * * *', (client) => {
    let birthdayArray = []
    let guilds = Guild.find({})

    guilds.forEach(guild_db => {
        let messageText = "Поздравляем {message} с днём рождения! Всем по тортику!"
        let guild = client.guilds.get(guilddb.guild)
        let birthdayChannel = guild.channels.get(guilddb.birthdayChannel)
        let birthdayMembers = birthdayAction.getTodayBirthdays(guild_db.guild)

        birthdayMembers.forEach(member => {
            let guildMember = guild.members.get(member.guildMemberId)
            birthdayArray.push(guildMember.toString())
        })
        messageText.replace(/{message}/, birthdayArray.join(" "))
        birthdayChannel.send(message)
    });
}, null, true, 'Europe/Moscow')


module.exports.birthdayJob = birthdayJob
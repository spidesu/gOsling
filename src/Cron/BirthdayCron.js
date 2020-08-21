const User = require("../Models/User")
const Guild = require("../Models/Guild")
let BirthdayCron = {
        execute: async (client) => {
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
            let birthdayMembers = await User.find({guild: guild_db.guild, $where: function () { return (this.birthDate.getDate() + '.' + this.birthDate.getMonth()) == (new Date().getDate() + '.' + new Date().getMonth())}})
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
    }
}

module.exports = BirthdayCron
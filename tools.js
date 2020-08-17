const Guild = require("./models/guild")
const User = require("./models/user")

let tools = {
    getGuildLanguage: async(guildId) =>
    {
        let guild = await Guild.findOne({guild:guildId})

        return guild.lang
    },

    formatDateDigit: digit =>
    {
        if (digit < 10)
        digit = '0' + digit

        return digit
    },

    formatDate (date) 
    {
        return this.formatDateDigit(date.getDate()) + '.' + this.formatDateDigit(date.getMonth()+1) + '.' + date.getFullYear()
    },

    getTodayBirthday: async(client) =>
    {
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

module.exports = tools
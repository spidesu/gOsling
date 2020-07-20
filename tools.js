const Guild = require("./models/guild")
const User = require("./models/user")

let tools = {
    getTodayBirthdays: async (guildId) =>
    {
        let birthdayMembers = await User.find({guild: guildId, $where: function () { return (this.birthDate.getDate() + '.' + this.birthDate.getMonth()) == (new Date().getDate() + '.' + new Date().getMonth())}})

        return birthdayMembers
    },
    getGuildLanguage: async(guildId) =>
    {
        let guild = await Guild.findOne({guild:guildId})

        return guild.lang
    }
}

module.exports = tools
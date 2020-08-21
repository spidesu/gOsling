const Guild = require("./src/Models/Guild")
const User = require("./src/Models/User")

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
    }
}

module.exports = tools
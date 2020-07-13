const User = require("../models/user")
//const { Guild } = require("discord.js")
const Guild = require("../models/guild")
class Birthday {
    constructor(args, guild, msg) 
    {
        this.args = args
        this.guild = guild
        this.msg = msg
    }
    async processCommand()
    {
        let answer
        console.log(this.action)
        console.log(this.args)
        switch (this.args.shift()) {
            case 'add':
                answer = await this.addBirthday(this.args, this.guild)
                break;
            case 'month':
                answer = await this.getMonthBirthday(this.args)
                break;
            case 'delete':
                answer = await this.deleteBirthday(this.args)
                break;
            case 'show':
                answer = await this.getBirthday(this.args)
                break;
            case 'channel':
                answer = await this.setBirthdayChannel(this.guild,this.msg.channel.id)
            default:
                break; 
        }

        return answer
    }
    async getBirthday(args)
    {
        let guildMemberId = args[0].replace(/\D/g,'')
        let user = await User.findOne({guildMemberId: guildMemberId})
        if (user)
        {
            let month = + user.birthDate.getMonth() + 1
        return "У этого прекрасного человека день рождения будет " + user.birthDate.getDate() + '.' + month + '.' + user.birthDate.getFullYear();
        }
        return "Я не нашел такого человека в базе(  "

    }

    async addBirthday(args, guildId)
    {
        let message
        let guildMemberId = args[0].replace(/\D/g,'')
        //let birthdate = args[1].replace(/\./g, '/')
        let birthdateRaw = args[1].split('.')
        let birthdate = birthdateRaw[2]+ '-' + birthdateRaw[1] + '-' + birthdateRaw[0]
        console.log(birthdate)
        birthdate = new Date(birthdate)
       // return new Promise(async (resolve, reject) => {
            let guild = await Guild.findOne({guild: guildId})
            if (!guild)
            {
                guild = new Guild({guild: guildId})
                await guild.save()
            }
            let user = await User.findOne({guildMemberId: guildMemberId});
            if (user)
            {
                user.birthDate = birthdate
                await user.save()
            }
            else
            {
                let user = new User({guildMemberId: guildMemberId, guild: guild._id, birthDate: birthdate})
                await user.save()
            }
            message = 'День рождения успешно добавлен/обновлен'
            return message
    //    });
    }

    async deleteBirthday(args)
    {
        let guildMemberId = args[0].replace(/\D/g,'')
        let user = await User.findOne({guildMemberId: guildMemberId});

        if (!user)
        {
            return "Не нашел такого юзера"
        }

        user.birthDate = null
        await user.save();
        return "День рождения успешно удален"
    }

    async setBirthdayChannel(guildId,channel)
    {
        let guild = await Guild.findOne({guild: guildId})
            if (!guild)
            {
                guild = new Guild({guild: guildId})
            }
        guild.birthdayChannel = channel
        await guild.save()
        return "На этот канал будут поступать сообщения о днях рождениях"
    }
}

module.exports = Birthday
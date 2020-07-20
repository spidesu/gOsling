const User = require("../models/user")
const tools = require ("../tools")
//const { Guild } = require("discord.js")
const Guild = require("../models/guild")
class Birthday {
    constructor(args, msg = null) 
    {
        this.args = args
        this.guild = msg.guild.id
        this.msg = msg
        this.typicalAnswer = "Тебе сюда нельзя"
        this.adminCommands = ['add','delete','channel','role']

    }
    async processCommand()
    {
        let command = this.args.shift()
        let answer
        //console.log(this.action)
        //console.log(this.args)
        //console.log(this.guild)
        if (this.adminCommands.indexOf(command) != -1)
        {
            if (!this.msg.member.hasPermission("ADMINISTRATOR"))
            return this.typicalAnswer
        }
        switch (command) {
            case 'add':
                answer = await this.addBirthday(this.args, this.guild, this.msg)
                break;
            case 'month':
                answer = await this.getMonthBirthday(this.args)
                break;
            case 'delete':
                answer = await this.deleteBirthday(this.args,this.msg)
                break;
            case 'show':
                answer = await this.getBirthday(this.args, this.msg)
                break;
            case 'channel':
                answer = await this.setBirthdayChannel(this.guild,this.msg.channel.id)
                break;
            case 'role':
                answer = await this.setBirthdayRole(this.args, this.guild,this.msg)
                break;
            case 'list':
                answer = await this.getBirthdayList(this.guild,this.msg)
            default:
                break; 
        }

        return answer
    }
    async getBirthday(args,msg)
    {
        let userName = args[0]
        let guildMember = msg.guild.members.cache.find(member => member.user.username === userName)
        let user = await User.findOne({guildMemberId: guildMember.id, birthDate: {$ne:null}})
        if (user)
        {
            let month = + user.birthDate.getMonth() + 1
        return "У этого прекрасного человека день рождения будет " + tools.formatDateDigit(user.birthDate.getDate()) + '.' + tools.formatDateDigit(month);
        }
        return "Я не нашел такого человека в базе(  "

    }

    async addBirthday(args, guildId,msg)
    {
        if (args.length < 2) return "Недостаточное количество аргументов"
        //console.log(guildId)
        let userName = args[0]
        let message
        let guildMember = msg.guild.members.cache.find(member => member.user.username === userName)
        let guildMemberId = guildMember.id
        //let birthdate = args[1].replace(/\./g, '/')
        let birthdateRaw = args[1].split('.')
        let birthdate = birthdateRaw[2]+ '-' + birthdateRaw[1] + '-' + birthdateRaw[0]
        console.log(birthdate)
        try{
            birthdate = new Date(birthdate)
        } catch (e) {
            return "Неправильный формат даты"
        }
       // return new Promise(async (resolve, reject) => {
            let guild = await Guild.findOne({guild: guildId})
            if (!guild)
            {
                guild = new Guild({guild: guildId})
                await guild.save()
            }
            let user = await User.findOne({guildMemberId: guildMemberId, guild: guildId});
            if (user)
            {
                user.birthDate = birthdate
                await user.save()
            }
            else
            {
                let user = new User({guildMemberId: guildMemberId, guild: guildId, birthDate: birthdate})
                await user.save()
            }
            message = 'День рождения успешно добавлен/обновлен'
            return message
    //    });
    }

    async deleteBirthday(args,msg)
    {
        let userName = args[0]
        let message
        let guildMember = msg.guild.members.cache.find(member => member.user.username === userName)
        let guildMemberId = guildMember.id
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


    async setBirthdayRole(args,guildId, msg)
    {
        let message = ""
        let roleName = args[0]
        let guild = await Guild.findOne({guild: guildId})
        
        if (!guild)
        {
            guild = new Guild({guild: guildId})          
        }
        let role = msg.guild.roles.cache.find(role => role.name === roleName)
        if (!role) {
            return 'Такой роли не существует' 
        }
        guild.birthdayRole = role.id
        await guild.save()
        message = 'Роль установлена!'

        return message

    }

    async getBirthdayList(guildId,msg)
    {
        let message = "Список дат рождений: \n"
        let users = await User.find({guild: guildId, birthDate: {$ne:null}})
        let userName
        users.forEach((user) => {
            userName = msg.guild.members.cache.find(member => member.user.id === user.guildMemberId)
            userName = userName.user.username
            message += userName + ' - ' + tools.formatDate(user.birthDate) + '\n'
        })

        return message
    }
}

module.exports = Birthday
const Roll = require("../models/roll")
class Dice {
    constructor(args, msg = null)
    {
        this.args = args
        this.msg = msg
    }

    async processCommand()
    {
        let answer
        let command = this.args[0]

        if (command.search(/^d\d*/) != -1) {
            answer = this.diceRoll()
            return answer
        }
        switch (command) {
            case 'create':
                answer = this.createRoll()
                break;    
            default:
                answer = this.customRoll(command)
                break;
        }
        return answer
        }
    
        async customRoll(command)
        {
            if (this.args.length < 2)
            {
                return "Недостаточное число аргументов"
            }
            let roll = await Roll.findOne({name: command, guild: this.msg.guild.id})
            let count = this.args[1]
            if (isNaN(+count))
            {
                return "Количество должно быть числом!"
            }
            let result = []
            let randomElement
            let repeats = []
            let answer
            if (!roll)
            {
                return 'Такого ролла не существует на сервере. Если хотите создать и ты админ, напишите g!roll create'
            }
            let maxRepeats = roll.options.maxRepeats
            let i = 0
            let max = (roll.elements.length * maxRepeats)
            if (count > max)
            {
                return 'Невозможно создать список такой длины из-за ограничений ролла. Максимальный размер списка:' + max
            }
            while (i < count)
            {
                let index = Math.floor(Math.random() * roll.elements.length)
                randomElement = roll.elements[index]
                if (typeof(repeats[randomElement]) === 'undefined')
                {
                    repeats[randomElement] = 0
                }

                if (repeats[randomElement] < maxRepeats)
                {
                   // console.log(repeats[randomElement])
                    result.push(randomElement)
                    repeats[randomElement]++
                    i++;

                } else {
                    roll.elements.splice(index,1)
                }
            }
            answer='Результат:\n'
            result.forEach((value) => {
                answer=answer + value + '\n'
            })

            return answer
        }

        async createRoll()
        {
            let collector
            let answer
            return 'Андер констракшн'
           // collector = await this.msg.channel.awaitMessages(filter)
           // answer = collector.first().content;
        }

    async getRandomValue(array)
    {
        randomElement = array[Math.floor(Math.random() * array.length)]

        return randomElement
    }
    async diceRoll()
    {
        let result = []
        if (this.args.length!=2)
        {
            return 'Ты введи какой дайс в виде d% и количество (d20 5), я тебе пороллю'
        }
        this.dice = this.args.shift()
        this.count = this.args.shift()
        console.log(typeof(+this.dice.substring(1)))

        this.diceType = this.dice.substring(1)
    
        if (isNaN(+this.count))
        {
            return 'Количество должно быть числом'
        }
        if (this.count > 100) {
            this.count = 100
        }
        for(let i = 0; i<this.count; i++) 
        {
            result.push(Math.floor(Math.random() * (this.diceType)) + 1)
        }
        return await this.toString(result)
    }

    async toString(result)
    {
        let dices = ''
        let answer
        let sum = 0
        result.forEach((value) => {
            dices+= value + ' '
            sum+= +value
        })
        answer=`Результат броска дайсов ${this.dice} :\n(${dices}) = ${sum}`
        return answer
    }
}

module.exports = Dice
class Dice {
    constructor(args, msg = null)
    {
        this.args = args
        this.msg = msg
    }

    async processCommand()
    {
        let result = []
        if (this.args.length!=2)
        {
            return 'Ты введи какой дайс в виде d% и количество (d20 5), я тебе пороллю'
        }
        this.dice = this.args.shift()
        this.count = this.args.shift()
        console.log(typeof(+this.dice.substring(1)))
        if (isNaN(+this.dice.substring(1)) || this.dice.substring(0,1) !== 'd')
        {
            return 'Введите дайс в формате d%'
        }
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
            result.push(Math.floor(Math.random() * (this.diceType - 1)) + 1)
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
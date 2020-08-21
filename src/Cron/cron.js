const CronJob = require('cron').CronJob;
const BirthdayCron = require ('./BirthdayCron');
class Cron {
    constructor(client)
    {
        this.client = client
    }
     crons = [
    {
        name : 'todayBirthday',
        action: BirthdayCron,
        enabledOnStart: true,
        time : '0 0 12 * * *'
    }
]
    start() {

        this.crons.forEach((value) =>{
            value.enabledOnStart ? (new CronJob(value.time, value.action.execute(this.client))).start() : false
        })
    }
}

module.exports = Cron

const BirthdayAction = require("./Actions/BirthdayAction");
const RollAction = require("./Actions/RollAction");

let Route = {

    routes : 
        [
            {
                name : 'birthday',
                action : BirthdayAction,
            }
            ,
            {
                name : 'roll',
                action: RollAction
            }
        ]
    ,
    async process (action,msg,args) {
        let route = this.routes.find(route => route.name === action)

        if (typeof(route) === 'undefined')
        {
            return false;
        }

        return await route.action.process(msg,args)
    }
}

module.exports = Route
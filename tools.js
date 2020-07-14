const { model } = require("./models/user")

let tools = {
    checkAdmin: async (msg) => {
        let check = msg.member.hasPermission("ADMINISTRATOR")

        if(check)
        {
            return true
        }
        return false
    }
}

module.exports = tools
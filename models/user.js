const {Schema,model} = require('mongoose')

const user = new Schema({
    guildMemberId: {
        type: String,
        required: true,
    },
    guild: {
        type: String,
        required: true,
    },
    birthDate: {
        type: Date,
        required: false,
    },
    created: {
        type:Date,
        default: Date.now()
    }

})

module.exports = model('User',user)
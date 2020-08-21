const {Schema,model} = require('mongoose')

const guild = new Schema({
    guild: {
        type: String,
        required: true,
    },
    birthdayChannel: {
        type: String,
        required: false,
    },
    birthdayRole: {
        type: String,
        required: false,
    },
    created: {
        type:Date,
        default: Date.now()
    },

})

module.exports = model('Guild',guild)
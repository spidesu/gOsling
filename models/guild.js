const {Schema,model} = require('mongoose')

const guild = new Schema({
    guild: {
        type: Number,
        required: true,
    },
    birthdayChannel: {
        type: Number,
        required: false,
    },
    birthdayRole: {
        type: Number,
        required: false,
    },
    created: {
        type:Date,
        default: Date.now()
    }

})

module.exports = model('Guild',guild)
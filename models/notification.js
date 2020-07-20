const {Schema,model} = require('mongoose')

const notification = new Schema({
    text: {
        type: String,
        required: true,
    },
    guild: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    created: {
        type:Date,
        default: Date.now()
    }

})

module.exports = model('Notification',notification)
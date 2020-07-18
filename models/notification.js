const {Schema,model} = require('mongoose')

const notification = new Schema({
    notificationText: {
        type: String,
        required: true,
    },
    guild: {
        type: Schema.Types.ObjectId,
        ref: 'Guild',
        required: true,
    },
    notificateTime: {
        type: Date,
        required: true,
    },
    created: {
        type:Date,
        default: Date.now()
    }

})

module.exports = model('Notification',notification)
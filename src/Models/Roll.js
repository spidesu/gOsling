const {Schema,model} = require('mongoose')

const roll = new Schema({
    name: {
        type: String,
        required: true,
    },
    elements: [{
        type: String,
        required: true,
    }],
    guild: {
        type: String,
        required: true,
    },
    options: {
        type: Object,
    },
    created: {
        type:Date,
        default: Date.now()
    }

})

module.exports = model('Roll',roll)
const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    conversation: {
        type: mongoose.Types.ObjectId,
        ref: 'conversation'
    },
    sender: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    recipent: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    textMessage: String,
    media: []
}, {
    timestamps: true
})

module.exports = mongoose.model('message', messageSchema)
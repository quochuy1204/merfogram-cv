const mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema({
    recipents: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'user'
        }
    ],
    textMessage: String,
    media: []
}, {
    timestamps: true
})

module.exports = mongoose.model('conversation', conversationSchema)
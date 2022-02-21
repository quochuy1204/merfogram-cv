const mongoose = require('mongoose')

const notifySchema = new mongoose.Schema({
    recognize_id: mongoose.Types.ObjectId,
    type: {
        type: String,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    recipents: [mongoose.Types.ObjectId],
    url: String,
    text: String,
    caption: String,
    image: String,
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('notify', notifySchema)
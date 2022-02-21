const mongoose = require('mongoose')

const commentModel = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    tag: Object,
    reply: mongoose.Types.ObjectId,
    likes: [{
        type: mongoose.Types.ObjectId, ref: 'user'
    }],
    user: {
        type: mongoose.Types.ObjectId, ref: 'user'
    },
    post_id: mongoose.Types.ObjectId,
    post_user_id: mongoose.Types.ObjectId
}, {
    timestamps: true
})

module.exports = mongoose.model('comment', commentModel)
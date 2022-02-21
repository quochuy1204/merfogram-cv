const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    caption: {
        type: String
    },
    images: {
        type: Array,
        required: true
    },
    likes: [{
        type: mongoose.Types.ObjectId,
        ref: 'user'
    }],
    comments: [{
        type: mongoose.Types.ObjectId,
        ref: 'comment'
    }],
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    isHidden: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    owner_username: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('post', postSchema);
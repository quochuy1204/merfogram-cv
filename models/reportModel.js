const mongoose = require('mongoose')

const reportSchema = mongoose.Schema({
    reporter_id: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    target_id: {
        type: mongoose.Types.ObjectId,
        ref: 'post',
        required: true
    },
    status: {
        type: Number,
        default: 0,
        required: true
    },
    category: {
        type: String,
        default: ''
    },
    report_content: {
        type: String,
        required: true,
        default: 'None'
    },
    target_images: {
        type: Array,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('report', reportSchema)
const mongoose = require('mongoose')

const userShema = mongoose.Schema({
    full_name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30
    },
    user_name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        default: 'https://res.cloudinary.com/hcm-city-university-of-education-and-technology/image/upload/v1635304905/psnap/user_ciin3x.png'
    },
    role: {
        type: Number,
        default: 0
    },
    gender: {
        type: String,
        default: 'male'
    },
    mobile: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    story: {
        type: String,
        default: '',
        maxlength: 200
    },
    website: {
        type: String,
        default: ''
    },
    followers: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'user'
        }
    ],
    following: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'user'
        }
    ],
    isBlocked: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('user', userShema)
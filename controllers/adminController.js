const userModel = require('../models/userModel')
const postModel = require('../models/postModel')
const { findOneAndUpdate } = require('../models/userModel')

const adminController = {
    getStatistic: async (req, res) => {
        try {
            const result = await userModel.find({ createdAt: { $regex: "" } })

            res.json(result)
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    getAllUsers: async (req, res) => {
        try {
            const users = await userModel.find().select("-password").sort('-createdAt').limit(100)

            res.json({ 
                users,
                result: users.length
             })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    getUsersBySearch: async (req, res) => {
        try {
            const users = await userModel.find({ user_name: { $regex: req.query.user_name } }).select("-password").sort('-createdAt').limit(50)

            res.json({ users })
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    },
    getPostsByUserId: async (req, res) => {
        try {
            const posts = await postModel.find({ user: req.params.id })

            res.json({
                posts
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    blockUser: async (req, res) => {
        try {
            const user = await userModel.findOneAndUpdate({ _id: req.params.id }, {
                isBlocked: 1
            }, { new: true })

            const posts = await postModel.updateMany({ user: user._id }, {
                isHidden: true
            })

            res.json({ user })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    unblockUser: async (req, res) => {
        try {
            const user = await userModel.findOneAndUpdate({ _id: req.params.id }, {
                isBlocked: 0
            }, { new: true })

            const posts = await postModel.updateMany({ user: user._id }, {
                isHidden: false
            })

            res.json({ user })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    blockPostById: async (req, res) => {
        try {
            const post = await postModel.findOneAndUpdate({ _id: req.params.id }, {
                isDeleted: true
            }, { new: true })

            if (!post) {
                return res.status(400).json({ message: "This post does not exist." })
            }

            res.json({
                post
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    unblockPostById: async (req, res) => {
        try {
            const post = await postModel.findOneAndUpdate({ _id: req.params.id }, {
                isDeleted: false
            }, { new: true })

            if (!post) {
                return res.status(400).json({ message: "This post does not exist." })
            }

            res.json({
                post
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    getAllPosts: async (req, res) => {
        try {
            const posts = await postModel.find().sort("user").sort("-createdAt").limit(100)
                .populate("user", "user_name photo fullname isBlocked")

            res.json({
                posts,
                result: posts.length
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    searchByPostOwner: async (req, res) => {
        try {
            const posts = await postModel.find({ owner_username: { $regex: req.query.username } }).sort("user").sort("-createdAt")
                .populate("user", "user_name full_name isBlocked photo")

            res.json({ posts })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

}

module.exports = adminController
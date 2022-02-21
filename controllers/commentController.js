const commentModel = require("../models/commentModel")
const postModel = require('../models/postModel')

const commentController = {
    createComment: async (req, res) => {
        try {
            const { post_id, content, tag, reply, post_user_id } = req.body

            // Trước khi thêm vào một comment thì kiểm tra xem post của comment đó
            // có tồn tại hay không, nếu post không tồn tại, tức đã bị xóa
            // thì return message và không thêm vào comment nữa
            const post = await postModel.findById(post_id)
            if (!post) {
                return res.status(400).json({ message: "This post does not exist." });
            }

            // Tương tự với reply comment
            if (reply) {
                const cm = await commentModel.findById(reply)
                if (!cm) {
                    return res.status(400).json({ message: "This comment does not exist." });
                }
            }

            const newComment = new commentModel({
                content, tag, reply, user: req.user._id, post_id, post_user_id
            })

            await postModel.findOneAndUpdate({ _id: post_id }, {
                $push: { comments: newComment._id }
            }, { new: true })

            await newComment.save()

            res.json({ newComment })
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    updateComment: async (req, res) => {
        try {
            const { content, _id } = req.body

            const newComment = await commentModel.findOneAndUpdate({ _id: _id, user: req.user._id }, {
                content: content
            }, { new: true })

            res.json({
                message: "Updated.",
                newComment
            })
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    likeComment: async (req, res) => {
        try {
            const newComment = await commentModel.findOneAndUpdate({ _id: req.params.id }, {
                $push: {
                    likes: req.user._id
                }
            }, { new: true })

            res.json({
                message: "Liked.",
                newComment
            })
        } catch (error) {
            return res.status(500).json({
                message: error.message
            });
        }
    },
    unlikeComment: async (req, res) => {
        try {
            const comment = await commentModel.findByIdAndUpdate({ _id: req.params.id }, {
                $pull: {
                    likes: req.user._id
                }
            }, { new: true })

            res.json({
                message: "Unliked.",
                comment
            })
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    deleteComment: async (req, res) => {
        try {
            const comment = await commentModel.findOneAndDelete({ _id: req.params.id }, {
                $or: [
                    { user: req.user._id }, { post_user_id: req.user._id }
                ]
            })

            await postModel.findOneAndUpdate({
                _id: comment.post_id
            }, {
                $pull: { comments: req.params.id }
            })

            res.json({ message: "Deleted." })
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = commentController
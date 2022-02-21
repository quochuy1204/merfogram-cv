const postModel = require('../models/postModel')
const commentModel = require('../models/commentModel')

class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    paginating() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 9;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

const postController = {
    createPost: async (req, res) => {
        try {
            const { caption, images } = req.body

            if (images.length === 0) {
                return res.status(400).json({ message: "Select an image." });
            }

            const newPost = new postModel({
                caption, images, user: req.user._id, owner_username: req.user.user_name
            })

            await newPost.save()

            res.json({
                message: "Your post has been shared.",
                newPost: {
                    ...newPost._doc,
                    user: req.user
                }
            })
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    getPosts: async (req, res) => {
        try {
            const features = new APIfeatures(postModel.find({
                user: [...req.user.following, req.user._id], isHidden: false, isDeleted: false
            }), req.query).paginating()

            const posts = await features.query
                .sort("-createdAt")
                .populate("user likes", "photo user_name full_name followers isBlocked isVerified")
                .populate({
                    path: "comments",
                    populate: {
                        path: "user likes",
                        select: "-password"
                    }
                })

            res.json({
                message: "Success.",
                result: posts.length,
                posts
            })
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    updatePost: async (req, res) => {
        try {
            const { caption, images } = req.body

            const result = await postModel.findOneAndUpdate({ _id: req.params.id }, {
                caption, images
            }).populate("user likes", "photo user_name full_name isBlocked")
                .populate({
                    path: "comments",
                    populate: {
                        path: "user likes",
                        select: "-password"
                    }
                })

            res.json({
                message: "Updated.",
                newPost: {
                    ...result._doc,
                    caption
                }
            })
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    likePost: async (req, res) => {
        try {
            const post = await postModel.find({ _id: req.params.id, likes: req.user._id })

            if (post.length > 0) {
                return res.status(400).json({ message: "You liked this post." });
            }

            const like = await postModel.findOneAndUpdate({ _id: req.params.id }, {
                $push: { likes: req.user._id }
            }, { new: true })

            if (!like) {
                return res.status(400).json({ message: "This post does not exist." });
            }

            res.json({ message: "Liked." });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    unlikePost: async (req, res) => {
        try {
            const like = await postModel.findOneAndUpdate({ _id: req.params.id }, {
                $pull: { likes: req.user._id }
            }, { new: true })

            if (!like) {
                return res.status(400).json({ message: "This post does not exist." });
            }

            res.json({ message: "Unliked." })
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    getUserPosts: async (req, res) => {
        try {
            const features = new APIfeatures(postModel.find({ user: req.params.id, isHidden: false, isDeleted: false }), req.query).paginating()
            const posts = await features.query.sort("-createdAt").populate("user", "isBlocked")

            res.json({
                posts,
                result: posts.length
            })
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    getPostById: async (req, res) => {
        try {
            const id = req.params.id

            const post = await postModel.findById(id)
                .populate("user likes", "photo user_name full_name followers isBlocked isVerified")
                .populate({
                    path: "comments",
                    populate: {
                        path: "user likes",
                        select: "-password"
                    }
                })

            if (!post) {
                return res.status(400).json({ message: "This post does not exist." });
            }

            res.json({
                post
            })
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    getPostsDiscover: async (req, res) => {
        try {
            const features = new APIfeatures(postModel.find({
                user: { $nin: [...req.user.following, req.user._id] }, isHidden: false, isDeleted: false
            }), req.query).paginating()

            const posts = await features.query.sort("-createdAt")

            res.json({
                message: "Success.",
                result: posts.length,
                posts
            })

            // const newArr = [...req.user.following, req.user._id]

            // const num = req.query.num || 9

            // const posts = await postModel.aggregate([
            //     { $match: { user: { $nin: newArr } } },
            //     { $sample: { size: Number(num) } }
            // ]).sort(arg)

            // return res.json({
            //     message: "Success.",
            //     posts,
            //     result: posts.length
            // })
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    deletePostById: async (req, res) => {
        try {
            const post = await postModel.findOneAndDelete({ _id: req.params.id, user: req.user._id })

            await commentModel.deleteMany({ _id: { $in: post.comments } })

            res.json({
                message: "Deleted.",
                newPost: {
                    ...post._doc,
                    user: req.user
                }
            })
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = postController;
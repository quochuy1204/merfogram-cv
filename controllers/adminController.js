// Model
const userModel = require('../models/userModel')
const postModel = require('../models/postModel')
const reportModel = require('../models/reportModel')

// Library
const mongoose = require('mongoose')

// Class APIfeatures
class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    // Function to handle the filter query
    filtering() {
        // Get all information of queryString Object and assign to the queryObj variable
        const queryObj = { ...this.queryString }

        // Check if the _id value valid with Type ObjectId or not
        // If not then delete the property _id in queryObj variable
        if (!mongoose.Types.ObjectId.isValid(queryObj._id)) {
            delete queryObj._id
        }

        // Create the Array String that contains some particular words
        const excludedFileds = ['page', 'sort', 'limit']

        // Check if into the Object queryObj has any property with the property name equal to any particular word in the excludedFields Array
        // If yes then delete that property in the queryObj
        excludedFileds.forEach(item => delete (queryObj[item]))

        // Convert the queryObj to String and assign the new string value to queryStr variable
        let queryStr = JSON.stringify(queryObj)

        // Check if into the queryStr variable have the word like gt, lt, lte, regex 
        // If yes then add the $ sign before each words
        queryStr = queryStr.replace(/gt|lt|gte|lte|regex/g, word => '$' + word)

        // Reassign the query value of APIfeatures class with the find() Query and the filter of the find() Query is equal to the queryStr
        this.query = this.query.find(JSON.parse(queryStr))

        // return the new query value to the APIfeatures class
        return this;
    }

    // Function to handle sort Query
    sorting() {

        // Check if into the queryString Object that has send from the client to server has the sort value or not
        if (this.queryString.sort) {

            // Create a new variable named sortBy and assign the sort value to it
            const sortBy = this.queryString.sort;

            // Reassign the query value of APIfeatures class with the sort() function Query and the query of the sort() function is equal to the sortBy
            this.query = this.query.sort(sortBy)

        } else { // Then if the sort value into the queryString Object does not exist
            // Assign the query value of APIfeatures with the sort() Query Function with the query variable = '-createdAt'
            this.query = this.query.sort('-createdAt')
        }

        return this;
    }
}


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
            const features = new APIfeatures(userModel.find().select("-password").limit(500), req.query).filtering().sorting()

            const users = await features.query

            // const users = await userModel.find().select("-password").sort('-createdAt').limit(100)

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
            // Get the post id from request params 
            const postId = req.params.id

            // If the post's ID does not exist then return the error message
            if (!postId) {
                return res.status(400).json({ message: "Post ID does not valid. Please try it again." })
            }

            // Check if the post exist into the database or not
            const checkPost = await postModel.findOne({ _id: postId })

            // If the post does not exist into the database then return the error message
            if (!checkPost) {
                return res.status(400).json({ message: "This post does not exist. Please try it again." })
            }

            // Check if the isDeleted value of post = true or not (isDeleted = true it mean that the post already blocked)
            if (checkPost.isDeleted === true) {
                return res.status(400).json({ message: "This post already blocked. Please choose another post and try it again." })
            }

            // Request the findOneAndUpdate request to mongoose to update the isDeleted value of post be long to post id
            const updatedPost = await postModel.findOneAndUpdate({ _id: postId }, {
                isDeleted: true
            }, { new: true })

            // If post does not exist then return the error message
            if (!updatedPost) {
                return res.status(400).json({ message: "This post does not exist." })
            }

            res.json({
                post: updatedPost,
                success: "Blocked post!"
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    unblockPostById: async (req, res) => {
        try {

            // Get post's ID from request params 
            const postId = req.params.id

            // Check if the post ID exist or not
            if (!postId) {
                return res.status(400).json({ message: "Post ID does not valid." })
            }

            // Check if the post exist into the database or not
            const checkPost = await postModel.findOne({ _id: postId })

            // If the post does not exist into the database then return the error message
            if (!checkPost) {
                return res.status(400).jso({ message: "This post does not exist. Please choose another post and try again." })
            }

            // Check if the isDeleted value of post = false or not (if isDeleted = false it mean the post already unblocked)
            if (checkPost.isDeleted === false) {
                return res.status(400).json({ message: "This post does not blocked yet. Please choose another post and try it again." })
            }

            // Request the findOneAndUpdate request to database server to update the isDeleted value of post to false
            const updatedPost = await postModel.findOneAndUpdate({ _id: req.params.id }, {
                isDeleted: false
            }, { new: true })

            if (!updatedPost) {
                return res.status(400).json({ message: "This post does not exist." })
            }

            res.json({
                post: updatedPost,
                success: "Unblock post!"
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    getAllPosts: async (req, res) => {
        try {
            const features = new APIfeatures(postModel.find({ isHidden: false }).limit(300).populate("user", "user_name photo fullname isBlocked"), req.query).filtering().sorting()

            const posts = await features.query

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
    },
    // Quoc Huy Add new features Date 09/05/2022
    getReports: async (req, res) => {
        try {
            const features = new APIfeatures(reportModel.find(), req.query).filtering().sorting()

            const reports = await features.query

            res.json({
                reports: reports,
                result: reports.length
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },

    // End Work Of Date 09/05/2022

    // Quoc Huy Add new Feature Date 10/05/22
    getReportDetail: async (req, res) => {
        try {
            // Get report id from request.params
            const reportId = req.params.id

            // Check if the report exist into Database or not
            const checkReport = await reportModel.findOne({ _id: reportId }).populate({
                path: 'target_id',
                populate: {
                    path: 'user',
                    select: '-password'
                }
            }).populate({
                path: 'reporter_id',
                select: '-password'
            })

            // If report does not exist into Database then response the error message
            if (!checkReport) {
                return res.status(400).json({ message: "Report does not exist. Please check it again." })
            }

            const relatedReports = await reportModel.find({ target_id: checkReport.target_id, status: checkReport.status, report_content: checkReport.report_content })

            res.json({
                reportDetail: checkReport,
                relatedReports: relatedReports
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },

    // End Work for Date 10/05/22

    // Quoc Huy Add new Features Date 11/05/22
    checkedReport: async (req, res) => {
        try {
            // Get the id params from the request params
            const id = req.params.id

            // Check if the report exist or not
            const checkedReport = await reportModel.findOne({ _id: id })

            // If report does not exist then response the error message
            if (!checkedReport) {
                return res.status(400).json({ message: "The report does not exist. Please check it again." })
            }

            // Check if the status of the report === 0 or not (0 = unchecked, 1 = checked)
            // If the report is checked so response the error message
            if (checkedReport.status === 1) {
                return res.status(400).json({ message: "This report already checked. Please choose another report." })
            }

            // update the status of the report to 1 (1 = checked) and return the updated report to client
            const updatedReport = await reportModel.findOneAndUpdate({ _id: checkedReport._id }, {
                status: 1
            }, {
                new: true
            })

            res.json({
                updatedReport: updatedReport,
                success: 'Checked report!'
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    // End Work for Date 11/05/22

    // Quoc Huy Add new features for Date 12/05/22

    // Function to unchecked report when 
    uncheckedReport: async (req, res) => {
        try {

            // Get report id from Request Params 
            const id = req.params.id

            // Check if report id exist or not
            if (!id) {
                return res.status(400).json({ message: "Report ID does not valid!" })
            }

            // Check if the report exist or not
            const checkReport = await reportModel.findOne({ _id: id })

            // If checkReport does not exist, then return the error message
            if (!checkReport) {
                return res.status(400).json({ message: "A report does not exist. Please check it again." })
            }

            // Check if the report's status = 0 or not (status = 0 it mean the report is already uncheck)
            // so return the error message
            if (checkReport.status === 0) {
                return res.status(400).json({ message: "This report are already unchecked. Please choose another report." })
            }

            // Find the specific report with report's id and update the status value to 0
            const updatedReport = await reportModel.findOneAndUpdate({ _id: id }, {
                status: 0
            }, {
                new: true
            })

            res.json({
                success: "Unchecked Report!",
                updatedReport: updatedReport
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    // End Work for Date 12/05/22
}

module.exports = adminController
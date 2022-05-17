const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const reportModel = require('../models/reportModel')
const postModel = require('../models/postModel')

const userController = {
    searchUser: async (req, res) => {
        try {
            const users = await userModel.find({ user_name: { $regex: req.query.user_name } }).limit(10).select("-password")

            res.json({ users });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    getUser: async (req, res) => {
        try {
            const id = req.params.id

            const user = await userModel.findById(id).select("-password")
                .populate("followers following", "-password")

            if (!user) {
                return res.status(400).json({ message: "User does not exist." });
            }

            res.json({ user })
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    updateUserInformation: async (req, res) => {
        try {
            //Lấy các giá trị gửi lên từ client
            const { photo, full_name, website, email, mobile, story, gender } = req.body

            //Kiểm tra xem giá trị full_name gửi lên từ client có tồn tại hay không
            //Nếu không thì trả về message
            if (!full_name) {
                return res.status(400).json({ message: "Enter your name." });
            }

            //Update thông tin user
            await userModel.findOneAndUpdate({ _id: req.user._id }, {
                photo, full_name, website, email, mobile, story, gender
            })

            res.json({ message: "Updated." })
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    followUser: async (req, res) => {
        try {
            const user = await userModel.find({ _id: req.params.id, followers: req.user._id })

            if (user.length > 0) {
                return res.status(400).json({ message: "You are following this account." });
            }

            const newUser = await userModel.findOneAndUpdate({ _id: req.params.id }, {
                $push: {
                    followers: req.user._id
                }
            }, { new: true }).populate("followers following", "-password")

            await userModel.findOneAndUpdate({ _id: req.user._id }, {
                $push: {
                    following: req.params.id
                }
            }, { new: true })

            res.json({
                message: 'Following account.',
                newUser
            })
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    unfollowUser: async (req, res) => {
        try {
            const newUser = await userModel.findOneAndUpdate({ _id: req.params.id }, {
                $pull: {
                    followers: req.user._id
                }
            }, { new: true }).populate("followers following", "-password")

            await userModel.findOneAndUpdate({ _id: req.user._id }, {
                $pull: {
                    following: req.params.id
                }
            }, { new: true })

            res.json({
                message: "Unfollowed account.",
                newUser
            })
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    // Hàm này sẽ lấy lên thông tin của những người mà là following của follower của mình
    // Tức có thể hiểu là bạn của bạn mình nhưng mình ko follow họ 
    suggestionUser: async (req, res) => {
        try {
            // Khởi tạo một array mà trong đó có tất cả _id của những người mình follow và _id của mình
            const newArr = [...req.user.following, req.user._id]

            // Khởi tạo biến num có thể = queryParams.num hoặc = 10
            const num = req.query.num || 5

            // Dùng hàm aggregate để lấy lên dữ liệu những user là bạn của bạn mình
            const users = await userModel.aggregate([
                { $match: { _id: { $nin: newArr } } },
                { $sample: { size: num } },
                { $lookup: { from: 'users', localField: 'followers', foreignField: '_id', as: 'followers' } },
                { $lookup: { from: 'users', localField: 'following', foreignField: '_id', as: 'following' } }
            ]).project("-password")

            // Trả về list users mới get từ db lên và trả về biến result là độ dài của list users
            return res.json({
                users,
                result: users.length
            })
        } catch (error) {
            return res.status(500).json({
                message: error.message
            });
        }
    },
    changePassword: async (req, res) => {
        try {
            const { old_password, new_password } = req.body

            if (!old_password) {
                return res.status(400).json({ message: 'Enter your current password.' })
            }

            if (!new_password) {
                return res.status(400).json({ message: "Enter your new password." })
            } else if (new_password.length < 8) {
                return res.status(400).json({ message: "Enter new password with at least 8 characters." });
            }

            const user = await userModel.findOne({ email: req.user.email, _id: req.user._id })

            if (!user) {
                return res.status(400).json({ message: "Account does not exist." })
            }

            const isMatch = await bcrypt.compare(old_password, user.password)

            if (!isMatch) {
                return res.status(400).json({ message: "Your current password is not correct. Please try it again." })
            }

            const hashPassword = await bcrypt.hash(new_password, 9)

            const newUser = await userModel.findOneAndUpdate({ email: user.email, _id: user._id }, {
                password: hashPassword
            })

            res.json({
                success: "Change password successful."
            })

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    // Quoc Huy Updated Functional Date 05/05/2022
    reportPost: async (req, res) => {
        try {
            // Lấy ra report được gửi từ client về server
            const report = req.body

            // Kiểm tra xem có giá trị report hay không?
            if (!report) {
                return res.status(400).json({ message: "Your reportation is not valid." })
            }

            // Nếu có report thì kiểm tra xem giá trị report_content trong report có tồn tại hay không?
            if (!report.report_content) {
                return res.status(400).json({ message: "Please choose your reason." })
            }

            // Lấy ra các giá trị tương tứng có trong report
            const { reporter_id, target_id, report_content } = report

            // Kiểm tra xem post bị report có tồn tại hay không
            // (Vì có thể chủ post đã xóa post đi)
            const checkPost = await postModel.findOne({ _id: target_id })

            // Nếu post bị report không tồn tại dưới database thì return về lỗi
            if (!checkPost) {
                return res.status(400).json({ message: "This post does't exist." })
            }

            // Kiểm tra xem report đã tồn tại dưới Database với cùng người report và cùng nội dùng hay không?
            const checkReport = await reportModel.find({ reporter_id: reporter_id, target_id: target_id })


            if (checkReport) {
                const check = checkReport.find(item => item.report_content === report_content)
                if (check) {
                    return res.status(400).json({ message: "You already report this post with the same reason." })
                }
            }

            // Tạo thực thể reportModel mới với nội dung được gửi lên server từ client
            const newReport = new reportModel(report)

            // Insert report vào Database
            await newReport.save()

            res.json({
                success: 'Reported!'
            })

        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    // End Work for Date 05/05/2022
    }
}

module.exports = userController
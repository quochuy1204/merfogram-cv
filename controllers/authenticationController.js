const { findOne } = require('../models/userModel')
const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')

const authenticationController = {
    register: async (req, res) => {
        try {

            // Lấy dữ liệu gửi lên từ client
            const {
                full_name,
                user_name,
                email,
                password
            } = req.body

            // Chuyển user_name thành dạng ghi thường và xóa khoảng trống
            let newUserName = user_name.toLowerCase().replace(/ /g, '')

            // Tìm user_name có tồn tại dưới Database hay không
            const userName = await User.findOne({ user_name: newUserName })

            // Kiểm tra, nếu user_name tồn tại thì trả về message
            if (userName) {
                return res.status(400).json({ message: `Another account is using usename: ${user_name}.` });
            }

            // Tìm email xem có tồn tại dưới Database hay không
            const userEmail = await User.findOne({ email: email })

            // Nếu email đã tồn tại thì trả về message
            if (userEmail) {
                return res.status(400).json({ message: `Another account is using email: ${email}.` });
            }

            // Kiểm tra xem password có đủ 8 ký tự hay không, nếu không thì gửi về client message
            if (password.length < 8) {
                return res.status(400).json({ message: "This password is too easy to guess. Please create a new one with more than 8 characters." });
            }

            // Mã hóa password
            const passwordHash = await bcrypt.hash(password, 9)

            const newUser = User({
                full_name,
                user_name: newUserName,
                email,
                password: passwordHash
            })

            // Tạo access token và refresh token
            const accessToken = createAccessToken({ id: newUser._id })

            const refreshToken = createRefreshToken({ id: newUser._id })

            // Lưu refresh token vào cookie
            res.cookie("refreshtoken", refreshToken, {
                httpOnly: true,
                path: '/api/refreshtoken',
                maxAge: 30 * 24 * 60 * 60 * 1000
            })

            await newUser.save();

            res.json({
                message: "Sign up successful.",
                accessToken,
                user: {
                    ...newUser._doc,
                    password: ''
                }
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    login: async (req, res) => {
        try {
            // Lấy email và password gửi lên từ client
            const { email, password } = req.body

            // Kiểm tra xem email có tồn tại hay không, nếu email không tồn tại thì gửi về message
            const user = await User.findOne({ email }).populate("followers following", "-password")
            // Nếu user không tồn tại thì gửi về message
            if (!user) {
                return res.status(400).json({ message: "The username you entered doesn't belong to an account. Please check your username and try again." });
            }

            if (user.isBlocked === 1) {
                return res.status(400).json({ message: "Your account has been blocked. Please contact us via merfogram@gmail.com for more information." })
            }

            // Kiểm tra xem password có đúng hay không
            const isMatch = await bcrypt.compare(password, user.password)

            // Nếu password không đúng trả về message
            if (!isMatch) {
                return res.status(400).json({ message: "Sorry, your password was incorrect. Please double-check your password." });
            }

            // Sau khi email và password đều đúng thì tạo access token và refresh token
            const accessToken = createAccessToken({ id: user._id })

            const refreshToken = createRefreshToken({ id: user._id })

            // Lưu lại refresh token ở cookie
            res.cookie("refreshtoken", refreshToken, {
                httpOnly: true,
                path: '/api/refreshtoken',
                maxAge: 30 * 24 * 60 * 60 * 1000
            })

            res.json({
                message: "Login successful.",
                accessToken,
                user: {
                    ...user._doc,
                    password: ""
                }
            })
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    generateAccessToken: async (req, res) => {
        try {
            // Lấy cookie gửi lên từ client
            const refresh_token = req.cookies.refreshtoken

            // Nếu cookie không tồn tại thì gửi về message
            if (!refresh_token) {
                return res.status(400).json({ message: "Please sign in now." });
            }

            // Nếu cookie tồn tại thì dùng jwt verify cookie và lấy về id của user
            jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, async function (err, result) {
                if (err) {
                    return res.status(400).json({ message: "Please sign in now." })
                }

                // Lấy ra tất cả thông tin của user đã đăng nhập, trừ password
                // Cũng như lấy ra tất cả thông tin của các followers và following person ( trừ password ) của người dùng đã đăng nhập
                const user = await User.findById({ _id: result.id }).select("-password").populate('followers following', '-password')

                // Nếu kết quả trả về không thấy người dùng nào thì gửi về message
                if (!user) {
                    return res.status(400).json({ message: "User does not exist." });
                }

                // Nếu kết quả trả về là một người dùng thì tiến hành tạo mới accesstoken cho người dùng đó
                const accesstoken = createAccessToken({ id: user._id })


                // Trả về cho client thông tin về accesstoken mới và thông tin người dùng
                res.json({
                    accesstoken,
                    user: {
                        ...user._doc
                    }
                });
            })
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie("refreshtoken", { path: '/api/refreshtoken' })
            return res.json({ message: "Logged out." })
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    checkIsBlockedUser: async (req, res) => {
        try {
            const user = await userModel.findOne({ _id: req.user._id, isBlocked: 1 })

            if (user) {
                return res.json({ isBlocked: true })
            }

            res.json({})
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

const createAccessToken = (payload) => {
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
    return accessToken
}

const createRefreshToken = (payload) => {
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' })
    return refreshToken
}

module.exports = authenticationController
const sendMail = require('../utils/sendMail')
const { CLIENT_URL } = process.env
const jsonwebtoken = require('jsonwebtoken')

const testController = {
    registerEmail: async (req, res) => {
        try {
            const { email, password } = req.body

            if (!email) {
                return res.status(500).json({ msg: "Enter your email address." });
            }

            const newUser = {
                email,
                password
            }

            const activationToken = createActivationToken(newUser)

            const url = `${CLIENT_URL}/user/authentication/${activationToken}`

            sendMail(email, url, text = 'Verify Your Account')

            res.json({ msg: "Register Successfully. Please check your email to activate your account." })
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

const createActivationToken = (payload) => {
    const activationToken = jsonwebtoken.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, { expiresIn: '5m' })
    return activationToken;
}

module.exports = testController
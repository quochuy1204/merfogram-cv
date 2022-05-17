const router = require('express').Router()
const authenticationController = require('../controllers/authenticationController')
const authentication = require('../middleware/authentication')

router.post('/register', authenticationController.registerEmail);
router.post('/login', authenticationController.login);
router.post('/refreshtoken', authenticationController.generateAccessToken);
router.post('/logout', authenticationController.logout);
router.post('/activation_email', authenticationController.activationEmail)
router.post('/forgot_password', authenticationController.forgotPassword)
router.post('/reset_password', authentication, authenticationController.resetPassword)

router.get('/checkisblockeduser', authentication, authenticationController.checkIsBlockedUser)

module.exports = router
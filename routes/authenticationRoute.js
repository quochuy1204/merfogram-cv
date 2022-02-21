const router = require('express').Router()
const authenticationController = require('../controllers/authenticationController')
const authentication = require('../middleware/authentication')

router.post('/register', authenticationController.register);
router.post('/login', authenticationController.login);
router.post('/refreshtoken', authenticationController.generateAccessToken);
router.post('/logout', authenticationController.logout);

router.get('/checkisblockeduser', authentication, authenticationController.checkIsBlockedUser)

module.exports = router
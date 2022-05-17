const express = require('express')
const router = express.Router()
const authentication = require('../middleware/authentication')
const userController = require('../controllers/userController')

router.get('/search', authentication, userController.searchUser);
router.get('/user/:id', authentication, userController.getUser);

router.patch('/user', authentication, userController.updateUserInformation)
router.patch('/user/:id/follow', authentication, userController.followUser)
router.patch('/user/:id/unfollow', authentication, userController.unfollowUser)

router.get('/suggestionUser', authentication, userController.suggestionUser);

router.post('/user/changepassword', authentication, userController.changePassword)

// Quoc Huy Updated Router Date 05/05/2022
router.post('/report_post', authentication, userController.reportPost)

module.exports = router
const router = require('express').Router()
const adminController = require('../controllers/adminController')
const authentication = require('../middleware/authentication')
const authenticationAdmin = require('../middleware/authenticatinAdmin')

router.get('/admin/getallusers', authentication, authenticationAdmin, adminController.getAllUsers)
router.get('/admin/searchuser', authentication, authenticationAdmin, adminController.getUsersBySearch)

// Get post
router.get('/admin/getallposts', authentication, authenticationAdmin, adminController.getAllPosts)
router.get('/admin/searchpost', authentication, authenticationAdmin, adminController.searchByPostOwner)

router.get('/admin/getposts/:id', authentication, authenticationAdmin, adminController.getPostsByUserId)

// Router for block and unblock user
router.patch('/admin/blockuser/:id', authentication, authenticationAdmin, adminController.blockUser)
router.patch('/admin/unblockuser/:id', authentication, authenticationAdmin, adminController.unblockUser)

// Router for block and unblock post
router.patch('/admin/blockpost/:id', authentication, authenticationAdmin, adminController.blockPostById)
router.patch('/admin/unblockpost/:id', authentication, authenticationAdmin, adminController.unblockPostById)

module.exports = router
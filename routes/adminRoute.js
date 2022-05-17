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

// Quoc Huy Add new Router Date 09/05/2022
router.get('/admin/get_reports', authentication, authenticationAdmin, adminController.getReports);
// End Work of Date 09/05/2022

// Quoc Huy Add new Router Date 10/05/22
router.get('/admin/get_report_detail/:id', authentication, authenticationAdmin, adminController.getReportDetail);
// End Work for Date 10/05/22

// Quoc Huy Add new Router Date 11/05/22
router.patch('/admin/checked_report/:id', authentication, authenticationAdmin, adminController.checkedReport)
// End Work for Date 11/05/22

// Quoc Huy Add new Router Date 12/02/22
router.patch('/admin/unchecked_report/:id', authentication, authenticationAdmin, adminController.uncheckedReport)
// End Work for Date 12/05/22

module.exports = router
const router = require('express').Router()
const authentication = require('../middleware/authentication')
const commentController = require('../controllers/commentController')

router.post('/comment', authentication, commentController.createComment)
router.patch('/comment/:id', authentication, commentController.updateComment)
router.patch('/comment/:id/like', authentication, commentController.likeComment)
router.patch('/comment/:id/unlike', authentication, commentController.unlikeComment)
router.delete('/comment/:id', authentication, commentController.deleteComment);

module.exports = router
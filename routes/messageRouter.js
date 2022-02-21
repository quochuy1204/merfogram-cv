const router = require('express').Router()
const messageController = require('../controllers/messageController')
const authentication = require('../middleware/authentication')

router.post('/message', authentication, messageController.createMessage)

router.get('/conversations', authentication, messageController.getConversations)
router.get('/message/:id', authentication, messageController.getMessages)

router.delete('/message/:id', authentication, messageController.deleteMessage)
router.delete('/conversation/:id', authentication, messageController.deleteConversation)

module.exports = router
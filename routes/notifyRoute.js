const express = require('express')
const router = express.Router()

const authentication = require('../middleware/authentication')
const notifyController = require('../controllers/notifyController')

router.post('/notify', authentication, notifyController.createNotify)
router.delete('/notify/:id', authentication, notifyController.deleteNotify);
router.get('/notifies', authentication, notifyController.getNotifies)
router.patch('/isReadNotify/:id', authentication, notifyController.isReadNotify)
router.delete('/deleteAllNotifies', authentication, notifyController.deleteAllNotifies)
router.patch('/markReadAll/:id', authentication, notifyController.markReadAll)

module.exports = router
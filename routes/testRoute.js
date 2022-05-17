const express = require('express')
const router = express.Router()
const testController = require('../controllers/testController')

router.post('/register_email', testController.registerEmail);

module.exports = router
const express = require('express')
const { createMessage, getMessages } = require('../controllers/messageController')
const { verifyToken } = require('../middlewares/jwt')

const router = express.Router()

router.post("/", verifyToken, createMessage)
router.get("/:id", verifyToken, getMessages)

module.exports = router
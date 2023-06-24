const express = require('express')
const { verifyToken } = require('../middlewares/jwt')
const { createOrder, getOrders, intent, confirmPay } = require('../controllers/orderController')

const router = express.Router()

// router.post("/:gigId", verifyToken, createOrder)
router.get("/", verifyToken, getOrders)
router.post("/create-payment-intent/:id", verifyToken, intent)
router.put("/", verifyToken, confirmPay)

module.exports = router
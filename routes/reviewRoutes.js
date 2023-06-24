const express = require('express')
const { verifyToken } = require('../middlewares/jwt')
const { createReview, getReviews, deleteReview } = require('../controllers/reviewController')

const router = express.Router()

router.post("/", verifyToken, createReview)
router.get("/:id", verifyToken, getReviews)
router.delete("/:id", verifyToken, deleteReview)

module.exports = router
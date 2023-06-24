const gigModel = require("../models/gigModel");
const reviewModel = require("../models/reviewModel");

const createReview = async (req, res) => {
  if(req.isSeller) {
    return res.status(403).send({
      success: false,
      message: "Sellers can't create a review!"
    })
  }
  const newReview = new reviewModel({
    userId: req.userId,
    gigId: req.body.gigId,
    desc: req.body.desc,
    star: req.body.star,
  })
  try {
    const review = await reviewModel.findOne({
      gigId: req.body.gigId,
      userId: req.userId
    })
    if(review) {
      return res.status(403).send({
        success: false,
        message: "You have already created a review for this gig!",
      })
    }
    const savedReview = await newReview.save();
    await gigModel.findByIdAndUpdate(req.body.gigId, {
      $inc: {totalStars: req.body.star, starNumber: 1}
    })
    res.status(200).send({
      success: true,
      message: "Gig saved Successfully!",
      data: savedReview
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error
    })
  }
}
const getReviews = async (req, res) => {
  try {
    const reviews = await reviewModel.find({gigId: req.params.id})
    res.status(200).send({
      success: true,
      message: "Gigs!",
      data: reviews
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      message: "Something went wrong",
      error
    })
  }
}
const deleteReview = async (req, res) => {}

module.exports = {createReview, getReviews, deleteReview}
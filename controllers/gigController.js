const gigModel = require("../models/gigModel");

const createGig = async (req, res) => {
  
  if(!req.isSeller) {
    return res.status(403).send({
      success: false,
      message: "Only sellers can create a gig!"
    })
  }
  const newGig = new gigModel({
    userId: req.userId,
    ...req.body
  })

  try {
    const savedGig = await newGig.save();
    res.status(200).send({
      success: true,
      message: "Gig saved Successfully!",
      data: savedGig
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

const deleteGig = async (req, res) => {
  try {
    const gig = await gigModel.findById(req.params.id)
    if(gig?.userId !== req.userId) {
      return res.status(403).send({
        success: false,
        message: "You can delete only your gig!"
      })
    }
    await gigModel.findByIdAndDelete(req.params.id)
    res.status(201).send({
      success: true,
      message: "Gig has been deleted!"
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
const getGig = async (req, res) => {
  try {
    const gig = await gigModel.findById(req.params.id)
    if(!gig) {
      res.status(404).send({
        success: false,
        message: "Gig not found!",
      })
    }
    res.status(200).send({
      success: true,
      message: "Single gig is available!",
      data: gig
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
const getGigs = async (req, res) => {
  const q = req.query
  const filters = {
    ...(q.userId && { userId: q.userId }),
    ...(q.cat && { cat: q.cat }),
    ...((q.min || q.max) && {
      price: {
        ...(q.min && { $gt: q.min }),
        ...(q.max && { $lt: q.max }),
      },
    }),
    ...(q.search && { title: { $regex: q.search, $options: "i" } }),
  };
  try {
    const gigs = await gigModel.find(filters).sort({[q.sort]:-1})
    if(gigs.length === 0) {
      res.status(404).send({
        success: false,
        message: "Gigs is empty!",
      })
    }
    res.status(200).send({
      success: true,
      message: "Gig List is available!",
      data: gigs
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

module.exports = {createGig, deleteGig, getGig, getGigs}
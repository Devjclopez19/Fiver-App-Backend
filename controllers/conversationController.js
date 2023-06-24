const conversationModel = require("../models/conversationModel");

const createConversation = async (req, res) => {
  const newConversation = new conversationModel({
    id: req.isSeller ? req.userId + req.body.to : req.body.to + req.userId,
    sellerId: req.isSeller ? req.userId : req.body.to,
    buyerId: req.isSeller ? req.body.to : req.userId,
    readBySeller: req.isSeller,
    readByBuyer: !req.isSeller,
  })

  try {
    const savedConversation = await newConversation.save()
    res.status(201).send({
      success: true,
      message: "Conversation saved Successfully!",
      data: savedConversation
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error
    })
  }
}
const getConversations = async (req, res) => {
  try {
    const conversations = await conversationModel.find(
      req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId}
    ).sort({updatedAt: -1})
    res.status(200).send({
      success: true,
      message: "Conversations is available!",
      data: conversations
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error
    })
  }
}
const getSingleConversation = async (req, res) => {
  try {
    const conversation = await conversationModel.findOne({id: req.params.id})
    if(!conversation) {
      return  res.status(404).send({
        success: false,
        message: "Not found!",
      })
    }
    res.status(200).send({
      success: true,
      message: "Conversation is available!",
      data: conversation
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error
    })
  }
}
const updateConversation = async (req, res) => {
  try {
    const updatedConversation = await conversationModel.findOneAndUpdate(
      {id: req.params.id},
      {
        $set : {
          ...(req.isSeller ? { readBySeller: true } : {readByBuyer: true})
        }
      },
      { new: true}
    )
    res.status(201).send({
      success: true,
      message: "Conversation is updated!",
      data: updatedConversation
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error
    })
  }
}

module.exports = { getConversations, createConversation, getSingleConversation, updateConversation  }
const conversationModel = require("../models/conversationModel");
const messageModel = require("../models/messageModel");

const createMessage = async (req, res) => {
  const newMessage = new messageModel({
    conversationId: req.body.conversationId,
    userId: req.userId,
    desc: req.body.desc,
  });
  try {
    const savedMessage = await newMessage.save();
    await conversationModel.findOneAndUpdate(
      { id: req.body.conversationId },
      {
        $set: {
          readBySeller: req.isSeller,
          readByBuyer: !req.isSeller,
          lastMessage: req.body.desc,
        },
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Message create Successfully!",
      data: savedMessage,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};
const getMessages = async (req, res) => {
  try {
    const messages = await messageModel.find({ conversationId: req.params.id });
    res.status(200).send({
      success: true,
      message: "Messages is available!",
      data: messages,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

module.exports = { createMessage, getMessages };

const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const getUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if(!user) {
      res.status(404).send({
        success: true,
        message: "User not found"
      })
    }
    res.status(200).send({
      success: true,
      message: "User is available",
      data: user
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong"
    })
  }

}

const deleteUser = async (req, res) => {
  const user = await userModel.findById(req.params.id);
  
  if (req.userId !== user?._id.toString()) {
    res
      .status(403)
      .send({ success: false, message: "You can delete only your account!" });
  }
  await userModel.findByIdAndDelete(req.params.id);
  res.status(200).send({
    success: true,
    message: "Deleted"
  })
};

module.exports = { deleteUser, getUser };

const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(400)
        .send({ success: false, message: "User already exist" });
    }
    const hash = bcrypt.hashSync(req.body.password, 5);
    const newUser = new userModel({
      ...req.body,
      password: hash,
    });
    await newUser.save();
    res.status(201).send({
      success: true,
      message: "User has been created.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong!",
      error,
    });
  }
};
const login = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    const isMatch = bcrypt.compareSync(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).send({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        isSeller: user.isSeller,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    const { password, ...info } = user._doc;

    res
      .cookie("accessToken", token, {
        secure: true,
      })
      .status(200)
      .send({
        success: true,
        message: "Login Success",
        data: info,
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong!",
      error,
    });
  }
};
const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .send({ success: true, message: "User has been logged out." });
};

module.exports = { register, login, logout };

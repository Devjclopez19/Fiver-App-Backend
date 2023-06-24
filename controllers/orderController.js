const gigModel = require("../models/gigModel");
const orderModel = require("../models/orderModel");
const Stripe = require("stripe");

const createOrder = async (req, res) => {
  try {
    const gig = await gigModel.findById(req.params.gigId)

    const newOrder = new orderModel({
      gigId: gig._id,
      img: gig.cover,
      title: gig.title,
      buyerId: req.userId,
      sellerId: gig.userId,
      price: gig.price,
      payment_intent: "temporary"
    })
    await newOrder.save()
    res.status(200).send({
      success: true,
      message: "Order saved Successfully!",
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

const getOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({
      ...(req.isSeller ? {sellerId: req.userId} : {buyerId: req.userId}),
      isCompleted: true
    })
    res.status(200).send({
      success: true,
      message: "Orders is available!",
      data: orders
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

const intent = async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE_KEY) 

  const gig = await gigModel.findById(req.params.id)

  const paymentIntent = await stripe.paymentIntents.create({
    amount: gig?.price * 100,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  const newOrder = new orderModel({
    gigId: gig._id,
    img: gig.cover,
    title: gig.title,
    buyerId: req.userId,
    sellerId: gig.userId,
    price: gig.price,
    payment_intent: paymentIntent.id
  })
  await newOrder.save()
  res.status(200).send({
    clientSecret: paymentIntent.client_secret,
  })

}

const confirmPay = async (req, res) => {
  try {
    const order = await orderModel.findOneAndUpdate({payment_intent: req.body.payment_intent}, {
      $set: {
        isCompleted: true
      }
    })
    res.status(200).send("Order has been confirmed!")
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error
    })
  }
}
module.exports = {createOrder, getOrders, intent, confirmPay}
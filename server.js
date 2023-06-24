const express = require("express");
const colors = require("colors");
const cors = require("cors");
// const morgan = require("morgan");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
// const path = require("path");

const authRoute = require("./routes/authRoutes");
const userRoute = require("./routes/userRoutes");
const gigRoute = require("./routes/gigRoutes");
const orderRoute = require("./routes/orderRoutes");
const conversationRoute = require("./routes/conversationRoutes");
const messageRoute = require("./routes/messageRoutes");
const reviewRoute = require("./routes/reviewRoutes");

// dotenv config
dotenv.config();

// mongodb connection
connectDB();

// rest object
const app = express();

// cors
app.use(cors({origin:"http://localhost:5173", credentials: true}));

// middlewares
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/gigs", gigRoute);
app.use("/api/orders", orderRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/reviews", reviewRoute);

// port
const port = process.env.PORT || 8800;

// pisten port
app.listen(port, () => {
  console.log(
    `Backend Server is Running in ${process.env.NODE_MODE} Mode on port ${port}`
      .bgCyan.white
  );
});

const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token)
    return res
      .status(401)
      .send({ success: false, message: "You are not auntheticated!" });

  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) return res.status(403).send("Token is not valid!");
    req.userId = payload.id;
    req.isSeller = payload.isSeller;
    next();
  });
};

module.exports = { verifyToken };

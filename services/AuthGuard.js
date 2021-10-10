const userModel = require("../models/UserModel");
const { verifyJwt } = require("./AuthService");

const verifyAuth = (type) => async (req, res, next) => {
  const bearerToken = req.header("Authorization");

  if (!bearerToken) {
    return res.status(401).json({
      message: `Invalid request: Missing Authorization header`,
    });
  }

  const token = bearerToken.split("Bearer ")[1];

  let decodedData = {};
  try {
    decodedData = await verifyJwt(token, type);
  } catch (ex) {
    return res.status(401).json({
      message: `Failed Authorization: Invalid refresh token`,
      details: ex.message,
    });
  }

  const foundUser = await userModel.findOne({ username: decodedData.username });

  if (!foundUser) {
    return res
      .status(401)
      .json({ message: "Failed Authorization. Invalid credentials" });
  }
  req.currentUser = foundUser.select("-password");
  next();
};

module.exports = verifyAuth;

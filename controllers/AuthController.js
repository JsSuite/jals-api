const userModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { signJwt, verifyJwt } = require("../services/AuthService");
const toJSON = require("../utils/toJSON");

const loginUser = async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(404).json({
      message: `Invalid body params: ${
        !req.body.username ? "'username' field is required." : ""
      } ${!req.body.password ? "'password' field is required." : ""}`,
    });
  }

  const foundUser = await userModel.findOne({ username: req.body.username });
  if (!foundUser) {
    return res
      .status(401)
      .json({ message: "Login Failed. Invalid credentials" });
  }

  const isCorrect = await bcrypt.compare(req.body.password, foundUser.password);
  if (!isCorrect) {
    return res
      .status(401)
      .json({ message: "Login Failed. Invalid credentials" });
  }

  const refreshToken = await signJwt(
    { ...toJSON(foundUser), auth_type: "REFRESH" },
    "30d"
  );
  const accessToken = await signJwt(
    { ...toJSON(foundUser), auth_type: "ACCESS" },
    3600
  );

  res.json({
    message: "Authenticated",
    refresh_token: `Bearer ${refreshToken}`,
    access_token: `Bearer ${accessToken}`,
  });
};

const refreshToken = async (req, res) => {
  const accessToken = await signJwt(
    { ...toJSON(req.currentUser), auth_type: "ACCESS" },
    3600
  );

  res.json({
    message: "Authenticated",
    access_token: `Bearer ${accessToken}`,
  });
};

module.exports = {
  loginUser,
  refreshToken,
};

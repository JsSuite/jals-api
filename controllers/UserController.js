const userModel = require("../models/UserModel");
const { verifyAuth } = require("../services/AuthService");
const toJSON = require("../utils/toJSON");

const createUser = async (req, res) => {
  const newUser = new userModel(req.body);

  try {
    await newUser.validate();
  } catch (ex) {
    return res.status(404).json({
      message: ex.message,
    });
  }

  await newUser.hashPassword();
  await newUser.save();
  const createdUser = await userModel
    .findOne({ _id: newUser._id })
    .select("-password");

  res.json({
    message: `New user ${createdUser.username} is created`,
    details: toJSON(createdUser),
  });
};

const getProfile = async (req, res) => {
  const currentUser = req.currentUser;
  if (!currentUser) {
    return res.status(401).json({
      message: "Unable to find user account",
    });
  }
  res.json(toJSON(currentUser));
};

module.exports = {
  createUser,
  getProfile,
};

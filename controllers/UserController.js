const userModel = require("../models/UserModel");
const toJSON = require("../utils/toJSON");

const createUser = async (req, res) => {
  const newUser = new userModel(req.body);

  try {
    await newUser.validate();
  } catch (ex) {
    return res.status(400).json({
      message: ex.message,
    });
  }

  await newUser.hashPassword();
  await newUser.save();

  const foundUser = await userModel.findOne({ _id: newUser._id });

  if (!foundUser) {
    return res.status(500).json({
      message: `Failed user creation`,
    });
  }

  delete foundUser.password;

  res.status(200).json({
    message: `New user ${foundUser.username} is created`,
    details: toJSON(foundUser),
  });
};

const getProfile = async (req, res) => {
  const currentUser = req.currentUser;
  if (!currentUser) {
    return res.status(401).json({
      message: "Unable to find user account",
    });
  }
  res.status(200).json(toJSON(currentUser));
};

module.exports = {
  createUser,
  getProfile,
};

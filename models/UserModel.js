const mongoose = require("mongoose");
const { generateSalt } = require("../services/AuthService");
const isEmail = require("../utils/isEmail");

const checkExists = (param) =>
  async function () {
    const foundUser = await this.db.models.User.findOne({
      [param]: this[param],
    });

    return !foundUser;
  };

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  username: {
    type: String,
    required: true,
    validate: [checkExists("username"), "Username already exists."],
  },
  password: { type: String, required: true },
  email: { type: String, required: true, validate: [isEmail, "Invalid email"] },
});

userSchema.methods.hashPassword = async function () {
  const hashedPassword = await generateSalt(this.password);
  this.password = hashedPassword;
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/UserModel");

const secretKey = process.env.SECRET_KEY || "JALS_SECRET$2021";

const generateSalt = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        reject(err);
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });
};

const signJwt = (payload, expiresIn) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secretKey, { expiresIn }, (error, token) => {
      if (error) {
        reject(error);
      }
      resolve(token);
    });
  });
};

const verifyJwt = (token, type) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decodedData) => {
      if (error) {
        reject(error);
      }

      if (decodedData.auth_type !== type) {
        reject(new Error("Wrong token type"));
      }
      resolve(decodedData);
    });
  });
};

module.exports = { signJwt, verifyJwt, generateSalt };

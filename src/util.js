const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./db/user_model');

const createJWT = (user, expiresIn) => jwt.sign(user, process.env.JWT_SECRET, {
  expiresIn,
});

const hashPassword = (password, callback) => {
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, callback);
};

const comparePassword = (password, hashedPassword, callback) => {
  bcrypt.compare(password, hashedPassword, callback);
};

const findUser = (user, callback) => {
  User.findOne(user, callback);
};

const saveUser = (user, callback) => {
  User.create(user, callback);
};

module.exports = {
  comparePassword,
  createJWT,
  findUser,
  hashPassword,
  saveUser,
};

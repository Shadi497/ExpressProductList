const bcrypt = require("bcrypt");
const { User } = require("../db/models");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
  const { password } = req.body;

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    req.body.password = hashedPassword;
    const newUser = await User.create(req.body);
    const payload = {
      id: newUser.id,
      username: newUser.username,
      firstname: newUser.firstname,
      exp: Date.now() + 5000,
    };
    const token = jwt.sign(JSON.stringify(payload), "superkey");
    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};

exports.signin = async (req, res, next) => {
  try {
    const { user } = req;
    const payload = {
      id: user.id,
      username: user.username,
      firstname: user.firstname,
      exp: Date.now() + 5000,
    };
    const token = jwt.sign(JSON.stringify(payload), "superkey");
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

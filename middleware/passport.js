const LocalStrategy = require("passport-local").Strategy;
const { User } = require("../db/models");
const bcrypt = require("bcrypt");

exports.localStrategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({
      where: {
        username,
      },
    });

    let passwordsMatch = user ? bcrypt.compare(password, user.passord) : false;
    return done(null, passwordsMatch ? user : false);
  } catch (error) {
    return done(error);
  }
});

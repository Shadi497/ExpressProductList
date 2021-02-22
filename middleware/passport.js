const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const { fromAuthHeaderAsBearerToken } = require("passport-jwt").ExtractJwt;
const { User } = require("../db/models");
const bcrypt = require("bcrypt");
const { JWT_SECRET } = require("../config/keys");

exports.jwtStrategy = new JWTStrategy(
  {
    jwtFromRequest: fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
  },
  async (jwtPayload, done) => {
    if (Date.now() > jwtPayload.exp) {
      //expired
      return done(null, false); //401 error
    } else {
      try {
        const user = await User.findByPk(jwtPayload.id);
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  }
);

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

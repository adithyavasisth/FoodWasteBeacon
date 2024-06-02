const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { findUser, validatePassword, findUserById } = require("../db/models/user");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await findUser(username);
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }
      if (!(await validatePassword(user, password))) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;

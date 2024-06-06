const jwt = require("jsonwebtoken");
const { createUser, updateUser } = require("../../db/models/user");
const passport = require("../../auth/passportConfig");

async function registerUser(req, res) {
  const { email, username, password } = req.body;
  try {
    const user = await createUser(email, username, password);
    req.login(user, (err) => {
      if (err) {
        res.status(500).send("Error logging in");
      } else {
        res.status(201).send("User created");
      }
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
}

async function loginUser(req, res) {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res
        .status(400)
        .json({ message: "Something is not right", user: user });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      jwt_body = { _id: user._id, email: user.email, username: user.username };
      const token = jwt.sign(jwt_body, process.env.JWT_SECRET);
      return res.json({ token });
    });
  })(req, res);
}

async function logoutUser(req, res) {
  res.clearCookie("connect.sid");
  req.logout(() => {
    req.session.destroy(() => {
      res.send();
    });
  });
  res.redirect("/");
}

async function updateUserDetails(req, res) {
  const { email, username, password } = req.body;
  try {
    await updateUser(req.user._id.toString(), email, username, password);
    res.status(200).send("User details updated");
  } catch (err) {
    res.status(400).send(err.message);
  }
}

module.exports = { registerUser, loginUser, logoutUser, updateUserDetails };

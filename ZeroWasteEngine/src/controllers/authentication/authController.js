const { createUser, updateUser } = require("../../db/models/user");

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
  res.redirect("/");
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

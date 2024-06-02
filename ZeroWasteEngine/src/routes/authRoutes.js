const express = require("express");
const passport = require("../auth/passportConfig");
const { createUser } = require("../db/models/user");
const router = express.Router();

router.post("/register", async (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;
  try {
    const user = await createUser(username, password);
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
});

router.post(
  "/login",
  passport.authenticate("local", {
    // successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: false, // Set to true if using connect-flash for flash messages
  }),
  (req, res) => {
    console.log(req.user);
    res.redirect("/");
  }
);

router.get("/logout", (req, res) => {
  res.clearCookie("connect.sid");
  req.logout(() => {
    console.log("Logged out.");
    req.session.destroy(() => {
      res.send(); 
    });
  });
  res.redirect("/");
});

module.exports = router;

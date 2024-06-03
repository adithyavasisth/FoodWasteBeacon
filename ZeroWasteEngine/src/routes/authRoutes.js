const express = require("express");
const authController = require("../controllers/authentication/authController");
const passport = require("../auth/passportConfig");
const router = express.Router();

/**
 * Express router for handling authentication routes.
 * @module authRoutes
 */

router.post("/register", authController.registerUser);

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: false, // Set to true if using connect-flash for flash messages
  }),
  authController.loginUser
);

router.get("/logout", authController.logoutUser);

router.put("/update", authController.updateUserDetails);

module.exports = router;

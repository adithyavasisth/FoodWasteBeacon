const express = require("express");
const authController = require("../controllers/authentication/authController");
const passport = require("../auth/passportConfig");
const router = express.Router();

/**
 * Express router for handling authentication routes.
 * @module authRoutes
 */

router.post("/register", authController.registerUser);

router.post("/login", authController.loginUser);

router.get("/logout", authController.logoutUser);

router.put("/update", passport.authenticate('jwt', { session: false }), authController.updateUserDetails);

module.exports = router;

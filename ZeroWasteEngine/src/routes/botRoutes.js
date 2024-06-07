const express = require("express");
const router = express.Router();
const passport = require("../auth/passportConfig");
const {
  bot,
  subscribe,
  unsubscribe,
  sendMessage,
  previewMessage
} = require("../controllers/bot/botController");

router.get(
  "/notification/preview/:id",
  passport.authenticate("jwt", { session: false }),
  previewMessage
);

router.post(
  "/notification/send/:id",
  passport.authenticate("jwt", { session: false }),
  sendMessage
);

bot.command("subscribe", subscribe);

bot.command("unsubscribe", unsubscribe);

module.exports = router;

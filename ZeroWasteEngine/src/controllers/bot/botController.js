const { Telegraf } = require("telegraf");
const {
  createSubscriber,
  deleteSubscriber,
  findSubscriberById,
  findSubscriberByUserId,
  getSubscribers,
} = require("../../db/models/subscribers");
const { findListingById, updateListing } = require("../../db/models/listings");
require("dotenv").config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

async function subscribe(ctx) {
  const { id, first_name, last_name, username } = ctx.update.message.from;
  const userInfo = { id, first_name, last_name, username };
  userInfo.username = username ? username : null;

  try {
    await createSubscriber(id, first_name, last_name, username);

    ctx.reply(
      `Thank you ${
        first_name ? first_name : last_name
      } for subscribing to our notifications! You'll now receive updates on new food listings and more.`
    );
  } catch (err) {
    ctx.reply(`You are already subscribed to our notifications.`);
  }
}

async function unsubscribe(ctx) {
  const { id } = ctx.update.message.from;

  try {
    await deleteSubscriber(id);
    ctx.reply("You have been unsubscribed from our notifications.");
  } catch (err) {
    ctx.reply("You are not subscribed to our notifications.");
  }
}

async function previewMessage(req, res) {
  try {
    const { id } = req.params;
    const listing = await findListingById(id);
    message = listing.message;
    res.status(200).json({ message });
  } catch (err) {
    res.status(500).json({ error: "Listing not found" });
  }
}

async function updateMessage(req, res) {
  try {
    const { id } = req.params;
    const listing = await findListingById(id);
    listing.message = req.body.message;
    await updateListing(
      id,
      listing.foodType,
      listing.quantity,
      listing.location,
      listing.availabilityTime,
      listing.message
    );
    res.status(200).json({ message: "Message updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update message" });
  }
}

async function sendMessage(req, res) {
  try {
    const { id } = req.params;
    const listing = await findListingById(id);

    const subscribers = await getSubscribers();
    subscribers.forEach(async (subscriber) => {
      await bot.telegram.sendMessage(subscriber.user_id, listing.message, {
        parse_mode: "MarkdownV2",
      });
    });
    res.status(200).json({ message: "Notification sent" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send notification" });
  }
}

bot.start((ctx) => {
  return ctx.reply(`Hello ${ctx.update.message.from.first_name}!`);
});

module.exports = {
  bot,
  subscribe,
  unsubscribe,
  sendMessage,
  previewMessage,
  updateMessage,
};

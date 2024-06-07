const { Telegraf, Markup } = require("telegraf");
const {
  createSubscriber,
  deleteSubscriber,
  findSubscriberById,
  findSubscriberByUserId,
  getSubscribers,
} = require("../../db/models/subscribers");
const {
  findListingById,
  updateInterestCount,
} = require("../../db/models/listings");
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

async function sendMessage(req, res) {
  try {
    const { id } = req.params;
    const listing = await findListingById(id);

    const subscribers = await getSubscribers();
    const options = {
      ...Markup.inlineKeyboard([
        Markup.button.callback(
          "Interested",
          JSON.stringify({
            action: "interested",
            listingId: id,
          })
        ),
        Markup.button.callback(
          "Not Interested",
          JSON.stringify({
            action: "not",
            listingId: id,
          })
        ),
      ]),
      parse_mode: "MarkdownV2",
    };
    subscribers.forEach(async (subscriber) => {
      await bot.telegram.sendMessage(
        subscriber.user_id,
        listing.message,
        options
      );
    });
    res.status(200).json({ message: "Notification sent" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send notification" });
  }
}

bot.on("callback_query", async (ctx) => {
  const { action, listingId } = JSON.parse(ctx.update.callback_query.data);
  const { userId } = ctx.update.callback_query.from;

  if (action === "interested") {
    await updateInterestCount(listingId, userId);
    await ctx.reply(
      "Thank you for your interest! We have noted your response."
    );
  } else if (action === "not_interested") {
    ctx.reply("Thank you for letting us know.");
  }

  ctx.editMessageReplyMarkup(undefined);
});

bot.start((ctx) => {
  return ctx.reply(`Hello ${ctx.update.message.from.first_name}!`);
});

module.exports = {
  bot,
  subscribe,
  unsubscribe,
  sendMessage,
  previewMessage,
};

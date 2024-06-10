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

    ctx.reply(`Hello ${first_name ? first_name : last_name}! 

Welcome to FoodWaste Beacon's SavorSignal Service. I am here to notify you about surplus food available on the VU Campus. You will receive food alerts from us whenever available.
    
Thank you for joining us in reducing food waste. Together we can make a difference!`);
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
  const { id } = ctx.update.callback_query.from;

  try {
    const listing = await findListingById(listingId);

    if (action === "interested") {
      if (listing.remaining === 0) {
        ctx.reply("Sorry, this listing has been fully claimed.");
        return;
      }

      try {
        await updateInterestCount(listingId, id, true);
        await ctx.reply(
          `Thank you for your interest ${ctx.update.callback_query.from.first_name}! 
Your interest has been noted. 
          
Please bring your own container to help us stay eco-friendly.
Please arrive before the time indicated to get your share of the food.
          
Thank you for taking part in our effort to minimize food waste.`
        );
      } catch (err) {
        ctx.reply("You have already shown interest in this listing.");
      }
    } else if (action === "not") {
      try {
        await updateInterestCount(listingId, id, false);
        ctx.reply("Thank you for letting us know.");
      } catch (err) {
        ctx.reply("You have already indicated that you are not interested.");
      }
    }
  } catch (err) {
    ctx.reply("Sorry, this listing is no longer available.");
    return;
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

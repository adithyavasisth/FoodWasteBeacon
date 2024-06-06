const { ObjectID } = require("mongodb");
const { client } = require("../connection");

async function createSubscriber(user_id, first_name, last_name, username) {
  const existingSubscriber = await findSubscriberByUserId(user_id);
  if (existingSubscriber) {
    throw new Error("Subscriber already exists");
  }

  const subscriber = { user_id, first_name, last_name, username };

  await client.connect();
  const database = client.db("ZeroWasteEngine");
  const subscribers = database.collection("subscribers");
  await subscribers.insertOne(subscriber);

  return subscriber;
}

async function getSubscribers() {
  await client.connect();
  const database = client.db("ZeroWasteEngine");
  const subscribers = database.collection("subscribers");
  return subscribers.find({}).toArray();
}

async function deleteSubscriber(user_id) {
  await client.connect();
  const database = client.db("ZeroWasteEngine");
  const subscribers = database.collection("subscribers");
  const result = await subscribers.deleteOne({ user_id });

  if (result.deletedCount === 0) {
    throw new Error("No subscriber found with this user_id");
  }
}

async function findSubscriberByUserId(user_id) {
  await client.connect();
  const database = client.db("ZeroWasteEngine");
  const users = database.collection("subscribers");
  return users.findOne({ user_id });
}

async function findSubscriberById(id) {
  await client.connect();
  const database = client.db("ZeroWasteEngine");
  const users = database.collection("subscribers");
  return users.findOne({ _id: new ObjectID(id) });
}

module.exports = {
  createSubscriber,
  getSubscribers,
  deleteSubscriber,
  findSubscriberByUserId,
  findSubscriberById,
};

const { ObjectId } = require('mongodb');
const { client } = require('../connection');
const bcrypt = require('bcryptjs');

async function createUser(username, password) {
  const existingUser = await findUser(username);
  if (existingUser) {
    throw new Error('Username already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 16);
  const user = { username, password: hashedPassword };

  await client.connect();
  const database = client.db('ZeroWasteEngine');
  const users = database.collection('users');
  await users.insertOne(user);

  return user;
}

async function findUser(username) {
  await client.connect();
  const database = client.db('ZeroWasteEngine');
  const users = database.collection('users');
  return users.findOne({ username });
}

async function validatePassword(user, inputPassword) {
  return bcrypt.compare(inputPassword, user.password);
}

async function findUserById(id) {
  await client.connect();
  const database = client.db('ZeroWasteEngine');
  const users = database.collection('users');
  return users.findOne({ _id: new ObjectId(id) });
}

module.exports = { createUser, findUser, validatePassword, findUserById };
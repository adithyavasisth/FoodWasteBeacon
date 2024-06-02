require('dotenv').config();

const username = encodeURIComponent(process.env.DB_USERNAME);
const password = encodeURIComponent(process.env.DB_PASSWORD);
const cluster = process.env.DB_CLUSTER_ADDRESS;

let uri = `mongodb+srv://${username}:${password}@${cluster}/`;

module.exports = {
  mongoUri: uri
};

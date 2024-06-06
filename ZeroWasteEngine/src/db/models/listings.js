const { ObjectId } = require("mongodb");
const { client } = require("../connection");
const {
  generateListingMessage,
} = require("../../services/listingMessageService");

async function createListing(
  foodType,
  quantity,
  location,
  availabilityTime,
  notifierID
) {
  const listing = {
    foodType,
    quantity,
    location,
    availabilityTime,
    notifierID,
  };
  listing.message = await generateListingMessage(listing);

  await client.connect();
  const database = client.db("ZeroWasteEngine");
  const listings = database.collection("listings");
  await listings.insertOne(listing);

  return listing;
}

async function getListings() {
  await client.connect();
  const database = client.db("ZeroWasteEngine");
  const listings = database.collection("listings");
  return listings.find({}).toArray();
}

async function updateListing(
  listingId,
  foodType,
  quantity,
  location,
  availabilityTime,
  message
) {
  const updatedListing = {
    foodType,
    quantity,
    location,
    availabilityTime,
    message,
  };

  await client.connect();
  const database = client.db("ZeroWasteEngine");
  const listings = database.collection("listings");
  const result = await listings.updateOne(
    { _id: new ObjectId(listingId) },
    { $set: updatedListing }
  );

  if (result.matchedCount === 0) {
    throw new Error("No listing found with this id");
  }

  return await listings.findOne({ _id: new ObjectId(listingId) });
}

async function deleteListing(listingId) {
  await client.connect();
  const database = client.db("ZeroWasteEngine");
  const listings = database.collection("listings");
  const result = await listings.deleteOne({ _id: new ObjectId(listingId) });

  if (result.deletedCount === 0) {
    throw new Error("No listing found with this id");
  }
}

async function findListingById(listingId) {
  await client.connect();
  const database = client.db("ZeroWasteEngine");
  const listings = database.collection("listings");
  return listings.findOne({ _id: new ObjectId(listingId) });
}

async function findListingsByNotifierID(notifierID) {
  await client.connect();
  const database = client.db("ZeroWasteEngine");
  const listings = database.collection("listings");
  return listings.find({ notifierID }).toArray();
}

module.exports = {
  createListing,
  getListings,
  updateListing,
  deleteListing,
  findListingById,
  findListingsByNotifierID,
};

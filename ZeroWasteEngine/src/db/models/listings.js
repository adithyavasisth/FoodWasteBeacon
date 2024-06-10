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
  notifierID,
  description
) {
  const listing = {
    foodType,
    quantity,
    location,
    availabilityTime,
    notifierID,
    description,
    remaining: quantity,
    interestedUsers: [],
  };
  listing.message = await generateListingMessage(listing);

  console.log(listing);

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

async function updateDescription(listingId, description) {
  await client.connect();
  const database = client.db("ZeroWasteEngine");
  const listings = database.collection("listings");
  const result = await listings.updateOne(
    { _id: new ObjectId(listingId) },
    { $set: { description } }
  );

  if (result.matchedCount === 0) {
    throw new Error("No listing found with this id");
  }

  return await listings.findOne({ _id: new ObjectId(listingId) });
}

async function updateListing(
  listingId,
  foodType,
  quantity,
  location,
  availabilityTime,
  description,
  remaining
) {
  const updatedListing = {
    foodType,
    quantity,
    location,
    availabilityTime,
    description,
    remaining,
  };
  updatedListing.message = await generateListingMessage(updatedListing);

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

async function updateInterestCount(listingId, userId, add) {
  await client.connect();
  const database = client.db("ZeroWasteEngine");
  const listings = database.collection("listings");
  const listing = await listings.findOne({ _id: new ObjectId(listingId) });
  var result;

  console.log(listing.interestedUsers, add);

  if (add) {
    if (listing.interestedUsers?.includes(userId)) {
      throw new Error("User has already shown interest in this listing");
    }

    result = await listings.updateOne(
      { _id: new ObjectId(listingId) },
      { $addToSet: { interestedUsers: userId } }
    );
  } else {
    console.log(listing.interestedUsers);
    if (!listing.interestedUsers?.includes(userId)) {
      throw new Error("User has not shown interest in this listing");
    }

    result = await listings.updateOne(
      { _id: new ObjectId(listingId) },
      { $pull: { interestedUsers: userId } }
    );
  }

  if (result.matchedCount === 0) {
    throw new Error("No listing found with this id");
  }

  return await listings.findOne({ _id: new ObjectId(listingId) });
}

async function updateClaimedCount(listingId, claimedCount) {
  await client.connect();
  const database = client.db("ZeroWasteEngine");
  const listings = database.collection("listings");
  const result = await listings.updateOne(
    { _id: new ObjectId(listingId) },
    { $set: { claimedCount } }
  );

  if (result.matchedCount === 0) {
    throw new Error("No listing found with this id");
  }

  return await listings.findOne({ _id: new ObjectId(listingId) });
}

module.exports = {
  createListing,
  getListings,
  updateListing,
  updateDescription,
  deleteListing,
  findListingById,
  findListingsByNotifierID,
  updateInterestCount,
  updateClaimedCount,
};

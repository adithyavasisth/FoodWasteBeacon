const {
  createListing,
  deleteListing,
  findListingById,
  findListingsByNotifierID,
  getListings,
  updateListing,
} = require("../../db/models/listings");

async function createFoodListing(req, res) {
  const { foodType, quantity, location, availabilityTime } = req.body;
  try {
    const listing = await createListing(
      foodType,
      quantity,
      location,
      availabilityTime,
      req.user._id.toString()
    );
    console.log(listing);
    res.status(201).send(listing);
  } catch (err) {
    res.status(400).send(err.message);
  }
}

async function getFoodListings(req, res) {
  try {
    const listings = await getListings();
    res.status(200).send(listings);
  } catch (err) {
    res.status(400).send(err.message);
  }
}

async function updateFoodListing(req, res) {
  const { foodType, quantity, location, availabilityTime } = req.body;
  try {
    const listing = await updateListing(
      req.params.id,
      foodType,
      quantity,
      location,
      availabilityTime
    );
    res.status(200).send(listing);
  } catch (err) {
    res.status(400).send(err.message);
  }
}

async function deleteFoodListing(req, res) {
  try {
    await deleteListing(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).send(err.message);
  }
}

async function findFoodListingById(req, res) {
  try {
    const listing = await findListingById(req.params.id);
    res.status(200).send(listing);
  } catch (err) {
    res.status(400).send(err.message);
  }
}

async function findFoodListingsByNotifierID(req, res) {
  try {
    const listings = await findListingsByNotifierID(req.params.id);
    res.status(200).send(listings);
  } catch (err) {
    res.status(400).send(err.message);
  }
}

module.exports = {
  createFoodListing,
  getFoodListings,
  findFoodListingById,
  findFoodListingsByNotifierID,
  updateFoodListing,
  deleteFoodListing,
};

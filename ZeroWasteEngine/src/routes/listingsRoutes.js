const express = require("express");
const router = express.Router();
const {
  createFoodListing,
  getFoodListings,
  updateFoodListing,
  deleteFoodListing,
  findFoodListingById,
  findFoodListingsByNotifierID,
} = require("../controllers/foodListings/listingsController");

router.post("/create", createFoodListing);
router.get("/all", getFoodListings);
router.get("/find/:id", findFoodListingById);
router.get("/find/notifier/:id", findFoodListingsByNotifierID);
router.put("/update/:id", updateFoodListing);
router.delete("/delete/:id", deleteFoodListing);

module.exports = router;

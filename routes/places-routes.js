const express = require("express");
const placesControllers = require("../controllers/places-controller");
const { check } = require("express-validator");

const router = express.Router();

router.get("/:id", placesControllers.getPlaceById);

router.get("/user/:uid", placesControllers.getPlacesUsersById);
router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placesControllers.createPlace
);
router.patch("/:id", placesControllers.updatePlace);
router.delete("/:id", placesControllers.deletePlace);
module.exports = router;

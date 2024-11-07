const express = require("express");
const placesControllers = require("../controllers/places-controller");

const router = express.Router();

router.get("/:id", placesControllers.getPlaceById);

router.get("/user/:uid", placesControllers.getPlaceUsersById);
router.post("/", placesControllers.createPlace);
router.patch("/:id", placesControllers.updatePlace);
router.delete("/:id", placesControllers.deletePlace);
module.exports = router;

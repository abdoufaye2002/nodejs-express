const express = require("express");

const router = express.Router();

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empiree",
    description: "lorem upsum elit description",
    location: {
      lat: 40.9999,
      long: -73.9822,
    },
    address: "avenue 209",
    creator: "u1",
  },
];

router.get("/:id", (req, res, next) => {
  const placeId = req.params.id;
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });
  if (!place) {
    const error = new Error("ID NON TROUVÉ");
    error.code = 404;
    return next(error);
  }
  res.json({ place });
});

router.get("/user/:uid", (req, res, next) => {
  const userId = req.params.uid;
  const place = DUMMY_PLACES.find((p) => {
    return p.creator === userId;
  });
  if (!place) {
    const error = new Error("ID NON TROUVÉ");
    error.code = 404;
    return next(error);
  }
  res.json({ place });
});
module.exports = router;

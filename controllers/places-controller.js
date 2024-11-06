const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");

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

const getPlaceById = (req, res, next) => {
  const placeId = req.params.id;
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });
  if (!place) {
    throw new HttpError("ID NON TROUVÉ", 404);
  }
  res.json({ place });
};

const getPlaceUsersById = (req, res, next) => {
  const userId = req.params.uid;
  const place = DUMMY_PLACES.find((p) => {
    return p.creator === userId;
  });
  if (!place) {
    return next(new HttpError("ID NON TROUVÉ", 404));
  }
  res.json({ place });
};
const createPlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = {
    id: uuidv4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };
  DUMMY_PLACES.push(createdPlace);
  res.status(201).json({ place: createdPlace });
  console.log(DUMMY_PLACES);
};

exports.getPlaceById = getPlaceById;
exports.getPlaceUsersById = getPlaceUsersById;
exports.createPlace = createPlace;

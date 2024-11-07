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
    return next(new HttpError("PLACE NON TROUVÉ", 404));
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
const updatePlace = (req, res, next) => {
  const { title, description } = req.body;
  const placeId = req.params.id;
  const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;
  DUMMY_PLACES[placeIndex] = updatedPlace;
  res.status(201).json({ place: updatedPlace });
  console.log(updatedPlace);
};
const deletePlace = (req, res, next) => {
  const placeId = req.params.id;
  const placeDelete = DUMMY_PLACES.filter((p) => p.id !== placeId);
  res.status(201).json({ message: "message supprimer" });
  console.log(placeDelete);
};
exports.getPlaceById = getPlaceById;
exports.getPlaceUsersById = getPlaceUsersById;
exports.createPlace = createPlace;
exports.deletePlace = deletePlace;
exports.updatePlace = updatePlace;

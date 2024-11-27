const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/places");

let DUMMY_PLACES = [
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

const getPlacesUsersById = (req, res, next) => {
  const userId = req.params.uid;
  const places = DUMMY_PLACES.filter((p) => {
    return p.creator === userId;
  });
  if (!places || places.length === 0) {
    return next(new HttpError("PLACES NON TROUVÉS", 404));
  }
  res.json({ places });
};
const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("L'entrer est invalide!", 422));
  }
  const { title, description, address, creator } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_State_Building_%28aerial_view%29.jpg",
    creator,
  });
  try {
    createPlace.save();
  } catch (err) {
    const error = new HttpError(
      "Echec de creation de lieu, essaie a nouveau!",
      500
    );
    return next(error);
  }
  res.status(201).json({ place: createdPlace });
};
const updatePlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("L'entrer est invalide!", 422);
  }
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
  if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
    throw new HttpError("Lieu non trouve", 422);
  }
  const placeDelete = DUMMY_PLACES.filter((p) => p.id !== placeId);
  res.status(201).json({ message: "Lieu supprimer" });
  console.log(placeDelete);
};
exports.getPlaceById = getPlaceById;
exports.getPlacesUsersById = getPlacesUsersById;
exports.createPlace = createPlace;
exports.deletePlace = deletePlace;
exports.updatePlace = updatePlace; // updatePlace

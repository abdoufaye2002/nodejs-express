const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
// const getCoordsForAddress = require("../util/location");
const Place = require("../models/places");
const User = require("../models/users");
const { default: mongoose } = require("mongoose");

// let DUMMY_PLACES = [
//   {
//     id: "p1",
//     title: "Empiree",
//     description: "lorem upsum elit description",
//     location: {
//       lat: 40.9999,
//       long: -73.9822,
//     },
//     address: "avenue 209",
//     creator: "u1",
//   },
// ];

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.id;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError("place non trouver", 500);
    return next(error);
  }
  if (!place) {
    const error = new HttpError("ID NON TROUVÉ", 404);
    return next(error); // make sure you return or throw the error
  }
  res.json({ place: place.toObject({ getters: true }) }); // La méthode .toObject() de Mongoose permet de convertir cet objet enrichi en un objet JavaScript classique (comme celui qu’on utilise normalement).
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  // let places;
  let userWithPlaces;
  try {
    // places = await Place.find({ creator: userId });
    userWithPlaces = await User.findById(userId).populate("places");
  } catch (err) {
    const error = new HttpError(
      "Createurs non trouver!!(probleme interne) reessai plutard",
      500
    );
    return next(error);
  }
  // if (!places || places.length === 0) {
  //   const error = new HttpError("Lieu non trouver", 404);
  //   return next(error);
  // }
  if (
    !userWithPlaces ||
    !userWithPlaces.places ||
    userWithPlaces.places.length === 0
  ) {
    const error = new HttpError("Lieu non trouver", 404);
    return next(error);
  }
  res.json({
    // places: places.map((place) => place.toObject({ getters: true })),
    places: userWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("L'entrée est invalide!", 422));
  }
  const { title, description, address, creator } = req.body;

  // Simuler des coordonnées aléatoires
  const coordinates = {
    lat: (Math.random() * 180 - 90).toFixed(6), // Latitude entre -90 et 90
    lng: (Math.random() * 360 - 180).toFixed(6), // Longitude entre -180 et 180
  };

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_State_Building_%28aerial_view%29.jpg",
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      "Creaton de lieu echouer,reessayer plus tard",
      500
    );
    return next(error);
  }
  if (!user) {
    const error = new HttpError(
      "Nous n'avons pas trouver cet utilisateur correspondant a cet Identifiant"
    );
    return next(error);
  }
  console.log(user);
  try {
    // await createdPlace.save(); // Assurez-vous d'attendre cette opération
    const sess = await mongoose.startSession(); // Démarre une session
    sess.startTransaction(); // Démarre une transaction
    await createdPlace.save({ session: sess }); // Sauvegarde `createdPlace` dans la session
    user.places.push(createdPlace); // Ajoute `createdPlace` à l'utilisateur
    await user.save({ session: sess }); // Sauvegarde l'utilisateur dans la session
    await sess.commitTransaction(); // Valide la transaction
  } catch (err) {
    const error = new HttpError(
      "Échec de la création de lieu, essaie à nouveau!",
      500
    );
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("L'entrée est invalide!", 422));
  }
  const { title, description } = req.body;
  const placeId = req.params.id;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Un probléme s'est produit,la mise a jour n'a pas pu etre effectuée",
      500
    );
    return next(error);
  }
  place.title = title;
  place.description = description;
  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Un probléme s'est produit,la mise a jour n'a pas pu etre effectuée",
      500
    );
    return next(error);
  }
  res.status(201).json({ place: place.toObject({ getters: true }) });
};

// const deletePlace = async (req, res, next) => {
//   const placeId = req.params.id;
//   let place;
//   try {
//     const sess = mongoose.startSession();
//     (await sess).startTransaction();
//     place = await Place.findByIdAndDelete(placeId).populate("creator")({
//       session: sess,
//     });
//     place.creator.places.pull(place);
//     await place.creator.save({ session: sess });
//   } catch (err) {
//     const error = new HttpError(
//       "Un probleme s'est produit,la mise a jour n'a pas pu etre effectuée",
//       500
//     );
//     return next(error);
//   }
//   if (!place) {
//     const error = new HttpError("Lieu non trouvé pour cet identifiant", 404);
//     return next(error);
//   }
//   res.status(201).json({ message: "Lieu supprimé" });
// };

const deletePlace = async (req, res, next) => {
  const placeId = req.params.id;

  let place;
  let sess;
  try {
    // Commencer une session
    sess = await mongoose.startSession();
    sess.startTransaction();

    // Trouver le lieu avec son créateur
    place = await Place.findById(placeId).populate("creator").session(sess);
    console.log(place);
    if (!place) {
      throw new HttpError("Lieu non trouvé pour cet identifiant", 404);
    }

    // Supprimer le lieu
    await place.deleteOne({ session: sess });

    // Mettre à jour le créateur en retirant le lieu
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });

    // Valider la transaction
    await sess.commitTransaction();
    sess.endSession();
  } catch (err) {
    if (sess) {
      await sess.abortTransaction(); // Annuler la transaction en cas d'erreur
      sess.endSession();
    }
    const error = new HttpError(
      "Un problème s'est produit, la suppression n'a pas pu être effectuée",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Lieu supprimé avec succès" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.deletePlace = deletePlace;
exports.updatePlace = updatePlace;

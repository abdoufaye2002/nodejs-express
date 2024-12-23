// const { v4: uuidv4 } = require("uuid");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/users");
// const DUMMY_USERS = [
//   {
//     id: "u1",
//     name: "abdou",
//     email: "test@test.com",
//     password: "tester",
//   },
// ];
const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Recherche d'utilisateurs echouer,veuiller reessayer plus tard",
      500
    );
    return next(error);
  }
  // Convertir chaque utilisateur en un objet JSON avec les getters
  res.json({ Users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("L'entrer est invalide!", 422));
  }
  const { name, email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "L'inscription a echoue,veuillez reessayer plus tard",
      500
    );
    return next(error);
  }
  if (existingUser) {
    const error = new HttpError(
      "L'utilisateur existe deja,veuiller vous connecter a la place",
      422
    );
    return next(error);
  }
  const createdUser = new User({
    name,
    email,
    image: `https://picsum.photos/400?random=${Math.floor(
      Math.random() * 1000
    )}`, // Générer une URL d'image aléatoire
    password,
    places: [],
  });
  try {
    await createdUser.save(); // Assurez-vous d'attendre cette opération
  } catch (err) {
    const error = new HttpError(
      "Échec de l'inscription, essaie à nouveau!",
      500
    );
    return next(error);
  }
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "La connexion a echoue,veuillez reessayer plus tard",
      500
    );
    return next(error);
  }
  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError("Donnee de connexion invalide", 401);
    return next(error);
  }
  res.json({ message: "CONNECTE" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;

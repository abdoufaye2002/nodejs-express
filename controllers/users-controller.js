const { v4: uuidv4 } = require("uuid");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/users");
const DUMMY_USERS = [
  {
    id: "u1",
    name: "abdou",
    email: "test@test.com",
    password: "tester",
  },
];
const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("L'entrer est invalide!", 422));
  }
  const { name, email, password, places } = req.body;
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
    places,
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

const login = (req, res, next) => {
  const { email, password } = req.body;
  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError("PAS D'IDENTIFIANT TROUVE", 401);
  }
  res.json({ message: "CONNECTE" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
//login

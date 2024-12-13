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

const signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("L'entrer est invalide!", 422);
  }
  const { name, email, password } = req.body;
  const existingUser = User.findOne({ email: email });
  const createdUser = {
    id: uuidv4(),
    name, // name:name
    email,
    password,
  };
  DUMMY_USERS.push(createdUser);
  res.status(201).json({ user: createdUser });
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

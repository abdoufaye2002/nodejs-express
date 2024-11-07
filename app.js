const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const placesRoutes = require("./routes/places-routes");
const HttpError = require("./models/http-error");
const port = 3000;
app.use(bodyParser.json());
app.use("/api/place", placesRoutes);

app.use((req, res, next) => {
  const error = new HttpError("DONNEES NON TROUVER", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "erreur non connu" });
});

app.listen(3000, () => {
  console.log(`http://localhost:${port}`);
});

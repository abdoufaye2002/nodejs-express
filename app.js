const express = require("express");
const app = express();
const mongoose = require("mongoose");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");
const port = 3000;

// Middleware pour parser les données JSON
app.use(express.json());

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

// Gestion des routes non trouvées
app.use((req, res, next) => {
  const error = new HttpError("DONNEES NON TROUVÉES", 404);
  throw error;
});

// Gestion des erreurs
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "Erreur non connue" });
});
mongoose
  .connect(
    "mongodb+srv://placesusers:UdXzhvK0bAl04inO@atlascluster.irokdqn.mongodb.net/userplaces?retryWrites=true&w=majority&appName=AtlasCluster"
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Erreur de connexion à MongoDB : ", err);
  });

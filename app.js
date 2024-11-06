const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const placesRoutes = require("./routes/places-routes");
const port = 3000;
app.use(bodyParser.json());
app.use("/api/place", placesRoutes);

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

const axios = require("axios");
const HttpError = require("../models/http-error");

const API_KEY = "AIzaSyDgLmMpKCzveJf1_yuA0fUzzhy0WRChvZA";

const getCoordsForAddress = async (address) => {
  //   return {
  //     lat: 40.7484474,
  //     lng: -73.9871516,
  //   };
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );
  const data = response.data;
  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError("erreur de la requere", 404);
  }
};

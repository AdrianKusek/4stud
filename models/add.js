const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dogBreedsArray = require("../utils/dogBreeds");

const addSchema = new Schema({
  title: String,
  description: String,
  age: Number,

  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  city: {
    type: String,
  },
  images: [
    {
      url: String,
      filename: String,
    },
  ],
  breed: {
    type: String,
    enum: dogBreedsArray,
  },
  gender: {
    type: String,
    enum: ["boy", "girl"],
  },

  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});
addSchema.methods.retlat = function (lat2, lon2, radius) {
  var lon1 = this.geometry.coordinates[0];

  var lat1 = this.geometry.coordinates[1];

  function getDistanceFromLatLonInKm(lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km

    return d;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  if (getDistanceFromLatLonInKm(lat2, lon2) < radius) {
    return true;
  } else {
    return false;
  }
};
addSchema.methods.yo = function (l, lon) {};

module.exports = mongoose.model("Add", addSchema);

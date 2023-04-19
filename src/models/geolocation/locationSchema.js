const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  status: {
    type: Boolean,
    default: true,
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "state",
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "city",
  },
  zone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "zone",
  },
  locationGrade: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

const LocationSchema = mongoose.model("location", locationSchema);

module.exports = LocationSchema;

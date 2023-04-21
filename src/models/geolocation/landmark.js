const mongoose = require("mongoose");

const landMarkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  status: {
    type: Boolean,
    default: true,
  },
  district: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "district",
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "state",
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "city",
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "location",
  },
  subLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subLocation",
  },
  zone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "zone",
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

const LandMarkSchema = mongoose.model("landmark", landMarkSchema);

module.exports = LandMarkSchema;

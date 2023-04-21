const mongoose = require("mongoose");

const subLocationSchema = new mongoose.Schema({
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
  district: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "district",
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "city",
  },
  zone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "zone",
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "location",
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

const SubLocationSchema = mongoose.model("subLocation", subLocationSchema);

module.exports = SubLocationSchema;

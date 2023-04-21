const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

const CitySchema = mongoose.model("city", citySchema);

module.exports = CitySchema;

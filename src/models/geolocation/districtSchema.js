const mongoose = require("mongoose");

const districtSchema = new mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

const DistrictSchema = mongoose.model("district", districtSchema);

module.exports = DistrictSchema;

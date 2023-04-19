const mongoose = require("mongoose");

const subDistrictSchema = new mongoose.Schema({
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
  // state: {
  //     type:mongoose.Schema.Types.ObjectId,
  //     ref:"state"
  // },
  // city: {
  //     type:mongoose.Schema.Types.ObjectId,
  //     ref:"city"
  // },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

const SubDistrictSchema = mongoose.model("subDistrict", subDistrictSchema);

module.exports = SubDistrictSchema;

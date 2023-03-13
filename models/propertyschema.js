const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({}, { strict: false });

const PropertySchema = mongoose.model("property", propertySchema);

module.exports = PropertySchema;
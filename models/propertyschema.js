const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({tracks_details: [{ type: mongoose.Schema.Types.ObjectId, ref: 'tracks' }]}, { strict: false });

const PropertySchema = mongoose.model("property", propertySchema);

module.exports = PropertySchema;
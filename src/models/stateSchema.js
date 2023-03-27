const mongoose = require("mongoose");

const stateSchema = new mongoose.Schema({ state_name: String });

const StateSchema = mongoose.model("state", stateSchema);

module.exports = StateSchema;
const mongoose = require("mongoose");

const stateSchema = new mongoose.Schema({ 
    name: {
        type: String,
        required: true
    },
    desc: String
 });

const StateSchema = mongoose.model("state", stateSchema);

module.exports = StateSchema;
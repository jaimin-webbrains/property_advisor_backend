const mongoose = require("mongoose");

const stateSchema = new mongoose.Schema({ 
    name: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    desc: String,
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date,
        default: new Date()
    }
 });

const StateSchema = mongoose.model("state", stateSchema);

module.exports = StateSchema;
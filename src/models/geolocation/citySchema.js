const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({ 
    name: {
        type: String,
        required: true
    },
    desc: String,
    status: {
        type: Boolean,
        default: true
    },
    state: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"state"
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date,
        default: new Date()
    }
 });

const CitySchema = mongoose.model("city", citySchema);

module.exports = CitySchema;
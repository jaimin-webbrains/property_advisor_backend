const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({ 
    name: {
        type: String,
        required: true
    },
    desc: String,
    state: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"state"
    }
 });

const CitySchema = mongoose.model("state", citySchema);

module.exports = CitySchema;
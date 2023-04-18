const mongoose = require("mongoose");

const zoneSchema = new mongoose.Schema({ 
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
    city: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"city"
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

const ZoneSchema = mongoose.model("zone", zoneSchema);

module.exports = ZoneSchema;
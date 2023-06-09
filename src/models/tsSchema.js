const mongoose = require("mongoose");

const tsSchema = new mongoose.Schema({
    state: {
        type: String,
        required: true
    },
    reraNumber: {
        type: String,
        required: true
    },
    lastModifiedDate: Date,
    reraApprovedDate: Date,
    reraProjectStartDate: Date,
    projectEndDate: Date,
    detailsURL: String,
    certFileName: {
        type: String,
        required: true
    },
    certExtFileName: {
        type: String
    },
    detailsFileName: {
        type: String,
        required: true
    },
    paId: {
        type: Number
    },
    city: String,
    location: String,
    subAreaName: String,
    propertyType: String,
    colonyName: String,
});

const TsSchema = mongoose.model("tracks", tsSchema);

module.exports = TsSchema;
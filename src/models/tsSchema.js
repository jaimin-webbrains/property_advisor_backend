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
    sellerMobile : Number,
    propertyInsert : String,
    propertyStatus : String,
    propertyFor : String,
    propertyCategory : String,
    propertyName : String,
    newsPaperName : String,
    surveyBy : String,
    surveyDate : Date,
    occupencyDate : Date,
    propertySpoc : String,
    gatedCommunityType : String,
    propertyStatus2 : String,
    loanBanks : String,
    totalFloors : Number,
    openSpaceArea : Number,
    commonArea : Number,
    dataEntryBy : String,
    newOrResale : String,
    reraStatus : String,
    price : Number,
    projectGrade : String,
    propertyDescription : String,
    propertySubType : String,
    facing : String,
    sizePerUnit : Number,
    amenitiesCharges : Number,
    otherCharges : Number,
    totalUnits : Number,
    totalAvailableUnits : Number,
    plotLayoutDescription : String,
    dimensionsRooms : String,
    description : String,
    length : Number,
    width : Number,
    nearByPlaces : String,
    amenities : String,
    selletComments : String,
    advisorComments : String,
    image : String,
    mainImage : String,
});

const TsSchema = mongoose.model("tracks", tsSchema);

module.exports = TsSchema;
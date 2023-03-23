const mongoose = require("mongoose");

const history = new mongoose.Schema({
   reraNumber:{
    type:String,
    required:true
   },
   lastModifiedDate:{
    type:Date,
    required:true
   }
}, { strict: false });

const propertyFieldHistorySchema = mongoose.model("property_field_history", history);

module.exports = propertyFieldHistorySchema;
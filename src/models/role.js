const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({ 
    name: {
        type: String,
        required: true
    },
    desc: String,
    status: {
        type: Boolean,
        default: true
    }
 });

const RoleSchema = mongoose.model("role", roleSchema);

module.exports = RoleSchema;
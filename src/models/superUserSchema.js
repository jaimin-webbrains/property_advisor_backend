const mongoose = require("mongoose");
require("dotenv").config();

const superuser = new mongoose.Schema({ 
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum : ['user','admin'],
        default: 'user'    
    },
    createdAt:  {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
 });

const superUser = mongoose.model("superadmin", superuser);
module.exports = superUser;
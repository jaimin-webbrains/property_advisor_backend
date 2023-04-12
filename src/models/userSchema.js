const mongoose = require("mongoose");
require("dotenv").config();

const user = new mongoose.Schema({ 
    name: {
        type: String,
        required:  true
    },
    mobile: {
        type: Number,
        required: true,
        min:10,
        max:10
    },
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
        default: true
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "role",
        required: true
    },
    createdAt:  {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date,
        default: new Date()
    }
 });

const User = mongoose.model("user", user);
module.exports = User;
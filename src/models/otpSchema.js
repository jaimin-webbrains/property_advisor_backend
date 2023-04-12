const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({ 
    email: {
        type: String,
        required: true
    },
    otp: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
 });

const OTPSchema = mongoose.model("OTP", otpSchema);

module.exports = OTPSchema;
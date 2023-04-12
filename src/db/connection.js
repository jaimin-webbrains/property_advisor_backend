const mongoose = require("mongoose");
const initdb = require('./initdb')
require("dotenv").config();
mongoose.connect(process.env.DATABASE_URL);
const conn = mongoose.connection;
conn.on("connected", function () {
    initdb()
    console.log("database is connected successfully");
});
conn.on("disconnected", function () {
    console.log("database is disconnected successfully");
});
conn.on("error", console.error.bind(console, "connection error:"));
module.exports = conn;

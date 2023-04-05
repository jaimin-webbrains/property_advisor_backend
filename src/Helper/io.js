const express = require("express");
require("dotenv").config();
const app = express();
const http = require('http')
const {Server} = require('socket.io')
const server = http.createServer(app)
const io = new Server(server,{
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET","POST"]
    }
})
module.exports = {io,server,app,express}
const express = require("express");
require("dotenv").config();
const app = express();
const http = require('http')
const {Server} = require('socket.io')
const server = http.createServer(app)
const FRONTEND_URL = process.env.IS_LIVE === "false" ? process.env.FRONTEND_URL : process.env.FRONTEND_LIVE_URL
const io = new Server(server,{
    cors: {
        origin: FRONTEND_URL,
        methods: ["GET","POST"]
    }
})
module.exports = {io,server,app,express}
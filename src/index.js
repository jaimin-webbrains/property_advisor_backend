const cors = require("cors");
const port = 3005;
const conn = require("./db/connection");
const propertyrouter = require("./routes/property");
const path = require("path");
const {io,server,app,express} = require('./Helper/io');
const authRouter = require("./routes/auth");
const geoLocationRouter = require("./routes/geoLocation");
const RoleRouter = require("./routes/role");
const userRouter = require("./routes/user");
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
const corsOpts = {
    origin: "*",
    methods: ["GET", "POST","DELETE"],
    allowedHeaders: ["Content-Type"],
};
app.use(cors(corsOpts));
io.on("connection",(socket) => {
})
app.use("/uploads", express.static(__dirname.replace("/src", "") + "/uploads"));
app.use("/property", propertyrouter);
app.use("/auth",authRouter)
app.use("/geo",geoLocationRouter)
app.use("/role",RoleRouter)
app.use("/user",userRouter)
app.use("/", express.static(__dirname.replace("/src", "") + "/public"));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname.replace("/src", ""), "public/index.html"));
});
server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

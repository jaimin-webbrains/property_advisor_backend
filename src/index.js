const express = require("express");
const cors = require("cors");
const app = express();
const port = 3005;
const conn = require("./db/connection");
const propertyrouter = require("./routes/property");
const path = require("path");
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
const corsOpts = {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
};
app.use(cors(corsOpts));
app.use(express.static("uploads"));
app.use("/property", propertyrouter);

// const root = require("path").join(__dirname.replace("src/",""), "public");
// app.use(express.static(root));
// app.get("*", (req, res) => {
//     res.sendFile("index.html", { root });
// });

app.use("/", express.static(__dirname.replace("/src", "") + "/public"));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname.replace("/src", ""), "public/index.html"));
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

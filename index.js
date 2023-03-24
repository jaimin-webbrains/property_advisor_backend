const express = require("express");
const cors = require('cors')
const app = express();
const port = 3005
const conn = require('./connection')
const propertyrouter = require("./routes/property");


app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
const corsOpts = {
  origin: '*',
  methods: ['GET', 'POST',],
  allowedHeaders: ['Content-Type',],
};
app.use(cors(corsOpts));
app.use(express.static('uploads'))
app.use('/property', propertyrouter)


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
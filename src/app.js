const express = require("express");
const cors = require("cors");
const routes = require("./routes.js");

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

module.exports = app;
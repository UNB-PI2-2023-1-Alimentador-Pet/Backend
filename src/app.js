const express = require("express");
const cors = require("cors");
const routes = require("./routes.js");
const cookieParser = require('cookie-parser');
const sequelize = require('sequelize');

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(routes);

module.exports = app;

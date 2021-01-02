const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongo = require("./database/mongo");
const appRoutes = require("./routes");

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

mongo.connect();

app.use(appRoutes);

module.exports = app;

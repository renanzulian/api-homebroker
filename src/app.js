const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require('mongoose');

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

mongoose.connect(
    'mongodb://localhost:27017/homebroker',
    { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => {
    console.log("Mongoose connect");
}).catch((err) => {
    console.log("ERROR! Not Connected to mongoose.", err);
});

app.post("/register", async (req, res) => {

});

app.use("*", (req, res) => {
  res.sendStatus(404);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Api running`);
});

const mongoose = require("mongoose");

exports.connect = () => {
  mongoose
    .connect(
      "mongodb+srv://api-hb:0QYTOE0d5XgaOuAo@hb1.iu1bi.mongodb.net/homebroker?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => {
      console.log("Mongoose connect");
    })
    .catch((err) => {
      console.log("ERROR! Not Connected to mongoose.", err);
    });
};

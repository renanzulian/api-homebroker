const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const userModule = require("./modules/user");
const walletModule = require("./modules/wallet");
const jwt = require("jsonwebtoken");

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/homebroker", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongoose connect");
  })
  .catch((err) => {
    console.log("ERROR! Not Connected to mongoose.", err);
  });

app.post("/register", async (req, res) => {
  const userData = req.body;
  if (userData.name && userData.email && userData.password) {
    try {
      const result = await userModule.registerUser(
        userData.name,
        userData.email,
        userData.password
      );
      res.status(201).json(result);
    } catch (error) {
      console.log(error.message);
      res.status(500).json(error);
    }
  } else {
    res.sendStatus(400);
  }
});

app.post("/login", async (req, res) => {
  const userData = req.body;
  if (userData.email && userData.password) {
    try {
      const result = await userModule.login(userData.email, userData.password);
      res.json(result);
    } catch (error) {
      console.log(error.message);
      switch (error.message) {
        case "Invalid credentials":
          res.sendStatus(406);
          break;
        case "User not found":
          res.sendStatus(406);
          break;
        default:
          res.status(500).json({ message: error.message });
          break;
      }
    }
  } else {
    res.sendStatus(400);
  }
});

const loginRequired = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    req.user = jwt.verify(token, "hard-secret-jwt");
    next();
  } catch (error) {
    res.sendStatus(401);
  }
};

app.post("/trade", loginRequired, async (req, res) => {
  const tradeData = req.body;
  if (tradeData.ticker && tradeData.quantity && tradeData.price) {
    try {
      await walletModule.toTradeStonks(
        req.user.id,
        tradeData.ticker,
        tradeData.quantity,
        tradeData.price
      );
      res.sendStatus(200);
    } catch (error) {
      console.log(error.message);
      res.status(500).send(error.message);
    }
  } else {
    req.sendStatus(400);
  }
});

app.use("*", (req, res) => {
  res.sendStatus(404);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Api running`);
});

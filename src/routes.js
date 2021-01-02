const express = require("express");
const login = require("./middlewares/login");
const userRoute = require("./modules/users/routes");
const walletRoute = require("./modules/wallet/routes");

const routes = express.Router();

routes.route("/register").post(userRoute.registerUser);

routes.route("/login").post(userRoute.login);

routes.route("/wallet").get(login.required, userRoute.wallet);

routes.route("/trade").post(login.required, walletRoute.trade);

routes.use("*", (req, res) => {
  res.sendStatus(404);
});

module.exports = routes;

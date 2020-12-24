const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const walletModule = require("./wallet");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    require: true,
    unique: true,
  },
  name: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
});

const User = mongoose.model("User", userSchema, "users");

exports.registerUser = async (name, email, password) => {
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    name: name,
    email: email,
    password: hashPassword,
  });
  await newUser.save();
  await walletModule.createWallet(newUser.id);
  return await this.login(newUser.email, password);
};

exports.getUserData = async (userId) => {
  const user = await User.findById(userId);
  const wallet = await walletModule.findWallet(userId);
  const tickers = wallet.stonks.map((stk) => stk.ticker);
  const transactions = await walletModule.findTransactions(wallet.id, tickers);
  return {
    name: user.name,
    email: user.email,
    balance: wallet.balance,
    stonks: wallet.stonks,
    transactions: transactions,
  };
};

exports.login = async (email, password) => {
  const user = await User.findOne({ email: email });
  if (user) {
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        "hard-secret-jwt"
      );
      return {
        token: token,
        name: user.name,
        email: user.email,
      };
    }
    throw new Error("Invalid credentials");
  }
  throw new Error("User not found");
};

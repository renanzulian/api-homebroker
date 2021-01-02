const mongoose = require("mongoose");

const walletSchema = mongoose.Schema({
  userId: {
    type: String,
    require: true,
    unique: true,
  },
  balance: {
    type: Number,
    require: true,
    default: 50000,
  },
  stonks: [
    {
      ticker: { type: String, require: true },
      quantity: { type: Number, require: true },
    },
  ],
});

exports.Wallet = mongoose.model("Wallet", walletSchema, "wallets");

const transactionSchema = mongoose.Schema({
  walletId: {
    type: String,
    require: true,
  },
  ticker: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  quantity: {
    type: Number,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  total: {
    type: Number,
    require: true,
  },
});

exports.Transaction = mongoose.model(
  "Transaction",
  transactionSchema,
  "transactions"
);

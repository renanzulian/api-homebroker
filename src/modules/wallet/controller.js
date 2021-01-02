const axios = require("axios");
const { Wallet, Transaction } = require("./models");

exports.findWallet = async (userId) => {
  return await Wallet.findOne({ userId: userId });
};

exports.findTransactions = async (walletId, tickers) => {
  return await Transaction.find({
    walletId: walletId,
    ticker: tickers,
  });
};

exports.createWallet = async (userId) => {
  const newWallet = new Wallet({ userId: userId });
  return await newWallet.save();
};

exports.toTradeStonks = async (userId, ticker, quantity, price) => {
  const wallet = await Wallet.findOne({ userId: userId });
  if (wallet) {
    const total = quantity * price;
    if (isAPurchase(quantity)) {
      addStonkInWallet(wallet, ticker, quantity, total);
    } else {
      removeStonksInWallet(wallet, ticker, quantity, total);
    }
    const transaction = new Transaction({
      walletId: wallet._id,
      ticker: ticker,
      quantity: quantity,
      price: price,
      total: total,
    });
    return {
      ...(await wallet.save()),
      ...(await transaction.save()),
    };
  }
  throw new Error("User not found");
};

isAPurchase = (quantity) => {
  return Math.sign(quantity) === 1;
};

addStonkInWallet = (wallet, ticker, quantity, total) => {
  if (walletContainsTicker(wallet, ticker)) {
    updateWalletStonk(wallet, ticker, quantity, total);
  } else {
    if (wallet.stonks.length < 3) {
      wallet.stonks.push({ ticker: ticker, quantity: quantity });
      wallet.balance -= Math.abs(total);
    } else {
      throw new Error("Wallet should contains only 3 stonks");
    }
  }
};

removeStonksInWallet = (wallet, ticker, quantity, total) => {
  if (walletContainsTicker(wallet, ticker)) {
    updateWalletStonk(wallet, ticker, quantity, total);
  } else {
    throw new Error("Wallet not contains the ticker");
  }
};

walletContainsTicker = (wallet, ticker) => {
  const stonk = wallet.stonks.filter((stk) => stk.ticker === ticker);
  return Boolean(stonk.length);
};

updateWalletStonk = (wallet, ticker, quantity, total) => {
  const stonk =
    wallet.stonks.filter((stk) => stk.ticker === ticker).pop() || {};
  if (stonk) {
    const newQuantity = stonk.quantity + quantity;
    if (newQuantity < 0) {
      throw new Error("Stonk quantity cannot be latest than 0 ");
    } else if (newQuantity === 0) {
      wallet.stonks = wallet.stonks.filter((stk) => stk.ticker !== ticker);
    } else {
      wallet.stonks = wallet.stonks.map((stk) => {
        if (stk.ticker === ticker) {
          stk.quantity += quantity;
          return stk;
        }
        return stk;
      });
    }
    const currentBalance = wallet.balance;
    const newBalance = isAPurchase(quantity)
      ? currentBalance - Math.abs(total)
      : currentBalance + Math.abs(total);
    if (newBalance < 0) {
      throw new Error("Balance enough");
    } else {
      wallet.balance = newBalance;
    }
  }
};

exports.getStonkDetails = async (ticker) => {
  const priceResponse = await axios.get(
    `https://www.alphavantage.co/query?symbol=${ticker}&function=TIME_SERIES_DAILY&apikey=KDHDQ1SL8QJT0ALN`
  );
  const details = priceResponse.data;
  return {
    currentPrice:
      details["Time Series (Daily)"][details["Meta Data"]["3. Last Refreshed"]][
        "4. close"
      ],
  };
};

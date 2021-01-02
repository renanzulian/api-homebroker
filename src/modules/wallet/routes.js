const controller = require("./controller");

exports.trade = async (req, res) => {
  const tradeData = req.body;
  if (tradeData.ticker && tradeData.quantity && tradeData.price) {
    try {
      await controller.toTradeStonks(
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
    res.sendStatus(400);
  }
};

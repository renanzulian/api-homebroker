const jwt = require("jsonwebtoken");

exports.required = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    req.user = jwt.verify(token, "hard-secret-jwt");
    next();
  } catch (error) {
    res.sendStatus(401);
  }
};

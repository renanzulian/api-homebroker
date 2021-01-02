const controller = require("./controller");

exports.registerUser = async (req, res) => {
  const userData = req.body;
  if (userData.name && userData.email && userData.password) {
    try {
      const result = await controller.registerUser(
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
};

exports.login = async (req, res) => {
  const userData = req.body;
  if (userData.email && userData.password) {
    try {
      const result = await controller.login(userData.email, userData.password);
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
};

exports.wallet = async (req, res) => {
  const response = await controller.getUserData(req.user.id);
  return res.json(response);
};

const mongoose = require("mongoose");

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
  const newUser = new User({ name: name, email: email, password: password });
  return await newUser.save();
};

exports.login = async (email, password) => {
  const user = await User.findOne({ email: email });
  if (user) {
    if (user.password === password) {
      return user;
    }
    throw new Error("Invalid credentials");
  }
  throw new Error("User not found");
};

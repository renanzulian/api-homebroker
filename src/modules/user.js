const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email
  }
};

exports.login = async (email, password) => {
  const user = await User.findOne({ email: email });
  if (user) {
    if (await bcrypt.compare(password, user.password)) {
      return user;
    }
    throw new Error("Invalid credentials");
  }
  throw new Error("User not found");
};

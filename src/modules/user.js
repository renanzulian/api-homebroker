const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email : {
        type: String,
        require: true,
        unique: true
    },
    name: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }

})

const User = mongoose.model('User', userSchema, 'users');

export async function registerUser(name, email, password) {
    const newUser = new User({name: name, email: email, password: password});
    return await newUser.save();
}
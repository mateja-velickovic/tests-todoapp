const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: String,
    address: String,
    zip: Number,
    location: String
});

const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;
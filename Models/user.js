const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    contact: {
        type: String,
        required: true
    },

    age: {
        type: Number
    },

    gender: {
        type: String
    },

    address: {
        type: String
    },

    city: {
        type: String
    },

    state: {
        type: String
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

const User = mongoose.model('User', userSchema);

module.exports = User;
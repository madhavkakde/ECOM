// models/User.js
const mongoose = require('mongoose');

// Define the user schema with additional fields
const userSchema = new mongoose.Schema({
    name: { type: String, required: true }, // User's name
    email: { type: String, required: true, unique: true }, // User's email
    password: { type: String, required: true }, // User's password
    phone: { type: String, required: true }, // User's phone number
});

// Create the User model
const User = mongoose.model('User ', userSchema);

module.exports = User;
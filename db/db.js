// db.js
require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Connect to the MongoDB database named 'ecommerce'
        await mongoose.connect(process.env.MONGODB_URI); 
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit the process with failure
    }
};

module.exports = connectDB;
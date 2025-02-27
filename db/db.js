// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Connect to the MongoDB database named 'ecommerce'
        await mongoose.connect('mongodb+srv://omkarkakde1023:RIDghtGTpIARyAfi@cluster1.wd0tt.mongodb.net/signup'); 
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit the process with failure
    }
};

module.exports = connectDB;
const mongoose = require('mongoose');

// Define the Review schema
const reviewSchema = new mongoose.Schema({
    headline: {
        type: String,
        required: true,
        trim: true
    },
    review: {
        type: String,
        required: true,
        trim: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1, // Minimum rating
        max: 5  // Maximum rating
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    product: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the Review model
const Review = mongoose.model('Review', reviewSchema);

// Export the model
module.exports = Review;
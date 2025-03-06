// models/Product.js
const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true // Removes whitespace from both ends
    },
    email:{
        type: String,
        required: true
    },
    shortDes: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0 // Price should be a positive number
    },
    detail: {
        type: String,
        required: true,
        trim: true
    },
    tags: {
        type: [String], // Array of strings for tags
        default: [] // Default to an empty array
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
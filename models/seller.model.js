// models/Seller.js
const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    businessName: { type: String, required: true },
    address: { type: String, required: true },
    about: { type: String, required: true },
    number: { type: String, required: true },
});

const Seller = mongoose.model('Seller', sellerSchema);
module.exports = Seller;
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            name: String,
            price: Number,
            quantity: { type: Number, required: true, default: 1 }
        }
    ],
    address: {
        name: { type: String, required: true },
        address: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        landmark: { type: String }
    },
    paymentMethod: { type: String, required: true },
    status: { type: String, default: "Pending" }, // Pending, Shipped, Delivered
    placedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", OrderSchema);

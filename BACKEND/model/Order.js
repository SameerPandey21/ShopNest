const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 1, min: 1 },
            price: { type: Number, default: 0, min: 0 }
        }
    ],
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            name: { type: String },
            price: { type: Number },
            qty: { type: Number, default: 1 },
            imageUrl: { type: String }
        }
    ],
    totalAmount: { type: Number, required: true },
    address: {
        FullName: { type: String, default: "" },
        fullName: { type: String, default: "" },
        StreetAddress: { type: String, default: "" },
        street: { type: String, default: "" },
        City: { type: String, default: "" },
        city: { type: String, default: "" },
        postalCode: { type: String, default: "" },
        Country: { type: String, default: "" },
        country: { type: String, default: "" }
    },
    paymentId: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered'], default: 'Pending' }
},
{ timestamps: true });
module.exports = mongoose.model('Order', orderSchema);
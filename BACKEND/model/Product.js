const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        imageUrls: {
            type: String,
            default: ""
        },
        imageUrl: {
            type: String,
            default: ""
        },
        stock: {
            type: Number,
            default: 10
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        rating: {
            type: Number,
            default: 0
        },
        numReviews: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

productSchema.pre("save", function () {
    if (!this.imageUrl && this.imageUrls) {
        this.imageUrl = this.imageUrls;
    }
    if (!this.imageUrls && this.imageUrl) {
        this.imageUrls = this.imageUrl;
    }
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
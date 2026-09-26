const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = require("./config/db.js");
const User = require("./model/user.js");
const Product = require("./model/Product.js");
const Order = require("./model/Order.js");

dotenv.config();

const productImage =
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop";

const users = [
    {
        name: "Admin User",
        email: "admin@shopnest.com",
        password: "admin123",
        role: "admin",
        verified: true,
    },
    {
        name: "Demo User",
        email: "user@shopnest.com",
        password: "user123",
        role: "user",
        verified: true,
    },
];

const products = [
    {
        name: "Classic Analog Watch",
        description: "A clean everyday watch with a stainless steel case and leather strap.",
        price: 2499,
        category: "Accessories",
        imageUrls: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop",
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop",
        stock: 25,
        rating: 4.5,
        numReviews: 18,
    },
    {
        name: "Wireless Bluetooth Headphones",
        description: "Comfortable over-ear headphones with deep bass and long battery life.",
        price: 3999,
        category: "Electronics",
        imageUrls: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop",
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop",
        stock: 40,
        rating: 4.7,
        numReviews: 32,
    },
    {
        name: "Cotton Casual T-Shirt",
        description: "Soft breathable cotton t-shirt for daily wear.",
        price: 799,
        category: "Fashion",
        imageUrls: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop",
        imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop",
        stock: 50,
        rating: 4.2,
        numReviews: 12,
    },
    {
        name: "Laptop Backpack",
        description: "Durable backpack with padded laptop storage and multiple compartments.",
        price: 1799,
        category: "Bags",
        imageUrls: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200&auto=format&fit=crop",
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200&auto=format&fit=crop",
        stock: 30,
        rating: 4.4,
        numReviews: 21,
    },
    {
        name: "Ceramic Coffee Mug",
        description: "Minimal ceramic mug for coffee, tea, or hot chocolate.",
        price: 399,
        category: "Home",
        imageUrls: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop",
        imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop",
        stock: 60,
        rating: 4.1,
        numReviews: 9,
    },
];

const upsertUsers = async () => {
    const savedUsers = {};

    for (const user of users) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const savedUser = await User.findOneAndUpdate(
            { email: user.email },
            { ...user, password: hashedPassword },
            { returnDocument: "after", upsert: true, setDefaultsOnInsert: true }
        );

        savedUsers[user.email] = savedUser;
    }

    return savedUsers;
};

const upsertProducts = async () => {
    const savedProducts = [];

    for (const product of products) {
        const savedProduct = await Product.findOneAndUpdate(
            { name: product.name },
            product,
            { returnDocument: "after", upsert: true, setDefaultsOnInsert: true }
        );

        savedProducts.push(savedProduct);
    }

    return savedProducts;
};

const createSampleOrder = async (demoUser, savedProducts) => {
    const paymentId = "pay_seed_demo_order";
    const existingOrder = await Order.findOne({ paymentId });

    if (existingOrder) {
        return existingOrder;
    }

    const orderProducts = savedProducts.slice(0, 2).map((product) => ({
        product: product._id,
        quantity: 1,
        price: product.price,
    }));

    const orderItems = savedProducts.slice(0, 2).map((product) => ({
        productId: product._id,
        name: product.name,
        price: product.price,
        qty: 1,
        imageUrl: product.imageUrl || product.imageUrls,
    }));

    const totalAmount = orderProducts.reduce((total, item) => total + item.price * item.quantity, 0);

    return Order.create({
        user: demoUser._id,
        products: orderProducts,
        items: orderItems,
        totalAmount,
        address: {
            FullName: "Demo User",
            fullName: "Demo User",
            StreetAddress: "221B Baker Street",
            street: "221B Baker Street",
            City: "Mumbai",
            city: "Mumbai",
            postalCode: "400001",
            Country: "India",
            country: "India",
        },
        paymentId,
        status: "Processing",
    });
};

const seedData = async () => {
    try {
        await connectDB();

        const savedUsers = await upsertUsers();
        const savedProducts = await upsertProducts();
        const sampleOrder = await createSampleOrder(savedUsers["user@shopnest.com"], savedProducts);

        console.log("Seed data generated successfully");
        console.log(`Users: ${Object.keys(savedUsers).length}`);
        console.log(`Products: ${savedProducts.length}`);
        console.log(`Sample order: ${sampleOrder._id}`);
        console.log("Admin login: admin@shopnest.com / admin123");
        console.log("User login: user@shopnest.com / user123");
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exitCode = 1;
    } finally {
        await mongoose.connection.close();
    }
};

seedData();

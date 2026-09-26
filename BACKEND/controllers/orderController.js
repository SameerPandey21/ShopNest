const Order = require("../model/Order.js");
 const sendEmail = require('../utils/sendEmail.js');

const createOrder = async (req, res) => {
    try {
        const { items, products, totalAmount, address, paymentId } = req.body;
        const orderList = items || products;
        if (!orderList || orderList.length === 0 || !totalAmount || !address) {
            return res.status(400).json({ message: "Invalid order data" });
        }

        const normalizedProducts = orderList.map((item) => ({
            product: item.productId || item.product || item._id,
            quantity: item.qty || item.quantity || 1,
            price: item.price || 0,
        }));

        const normalizedItems = orderList.map((item) => ({
            productId: item.productId || item.product || item._id,
            name: item.name || "Product",
            price: item.price || 0,
            qty: item.qty || item.quantity || 1,
            imageUrl: item.imageUrl || item.imageUrls || "",
        }));

        const normalizedAddress = {
            FullName: address.FullName || address.fullName || "",
            fullName: address.fullName || address.FullName || "",
            StreetAddress: address.StreetAddress || address.street || "",
            street: address.street || address.StreetAddress || "",
            City: address.City || address.city || "",
            city: address.city || address.City || "",
            postalCode: address.postalCode || "",
            Country: address.Country || address.country || "",
            country: address.country || address.Country || "",
        };

        const order = new Order({
            user: req.user._id,
            products: normalizedProducts,
            items: normalizedItems,
            totalAmount,
            address: normalizedAddress,
            paymentId,
        });

        await order.save();

        try {
            const message = `Dear ${req.user.name},\n\nYour order has been successfully created. Your order ID is ${order._id}.\n\nThank you for shopping with us!\n\nBest regards,\nSHOPNEST Team`;
            await sendEmail(req.user.email, "Order Created", message);
        } catch (emailErr) {
            console.error("Order notification email failed:", emailErr.message);
        }

        res.status(201).json({ message: "Order created successfully", order });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Error creating order", error: error.message });
    }
};

const myOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate("products.product", "name price imageUrl imageUrls")
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "id name email")
            .populate("products.product", "name price imageUrl imageUrls")
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
};

const updateOrderStatus = async (req,res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);
        if(!order){
            return res.status(404).json({ message: "Order not found" });
        }
        order.status = status;
        await order.save();
        res.status(200).json({ message: "Order status updated successfully", order });
    } catch(error){
        res.status(500).json({ message: 'Error updating order status', error });
    }
};
module.exports = { createOrder, myOrders, getOrders, updateOrderStatus };
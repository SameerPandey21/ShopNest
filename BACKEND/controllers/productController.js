const Product = require("../model/Product.js");
const cloudinary = require("../config/cloudinary.js");
const getProducts = async (req, res) => {
    try {
        const products = await Product.find().lean();
        const formatted = products.map((p) => ({
            ...p,
            imageUrl: p.imageUrl || p.imageUrls || "",
            imageUrls: p.imageUrls || p.imageUrl || "",
        }));
        res.json(formatted);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).lean();
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        product.imageUrl = product.imageUrl || product.imageUrls || "";
        product.imageUrls = product.imageUrls || product.imageUrl || "";
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        let imageUrl = req.body.imageUrl || req.body.imageUrls || "";
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url;
        }
        const product = new Product({
            name,
            description,
            price,
            category,
            stock: stock || 10,
            imageUrl,
            imageUrls: imageUrl,
        });
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }

};
const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price !== undefined ? price : product.price;
        product.category = category || product.category;
        product.stock = stock !== undefined ? stock : product.stock;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            product.imageUrl = result.secure_url;
            product.imageUrls = result.secure_url;
        } else if (req.body.imageUrl || req.body.imageUrls) {
            product.imageUrl = req.body.imageUrl || req.body.imageUrls;
            product.imageUrls = product.imageUrl;
        }

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ message: "Product deleted" });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
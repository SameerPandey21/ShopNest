const mongoose = require("mongoose");
const dns = require("dns");

// Set default DNS servers to Google Public DNS to resolve SRV records properly on Windows
try {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (err) {
    console.warn("Notice: Custom DNS servers could not be set (normal in some cloud environments):", err.message);
}

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
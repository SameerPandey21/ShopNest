const mongoose = require("mongoose");
const dns = require("dns");

// Set default DNS servers to Google Public DNS only on Windows where SRV records often fail
if (process.platform === "win32") {
    try {
        dns.setServers(["8.8.8.8", "8.8.4.4"]);
    } catch (err) {
        console.warn("Notice: Custom DNS servers could not be set:", err.message);
    }
}

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        // Do not process.exit(1) so web server stays alive and serves healthcheck/frontend
    }
};

module.exports = connectDB;
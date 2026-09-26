const Order = require('../model/Order.js');
const User = require('../model/user.js');
const product = require('../model/Product.js');

const getAdminStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments({});
        const totalUsers = await User.countDocuments({role: 'user'});
        const totalProducts = await product.countDocuments({});
        
        const orders = await Order.find({});
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

        res.json({
            totalOrders,
            totalUsers,
            totalProducts,
            totalRevenue
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admin stats', error });
    }
        };

module.exports = { getAdminStats };        
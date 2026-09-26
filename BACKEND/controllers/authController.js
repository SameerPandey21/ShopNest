const User = require("../model/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail.js");


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
}

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        // Hash the password before saving it to the database
        // implement jwt token generation and return it in the response
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({ name, email, password: hashedPassword });
        if (user) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
             // Generate a 6-digit OTP
             const message = `Welcome to shopnest, ${name}! Thank you for registering. Your OTP is: ${otp}`;
             await sendEmail(email, "Welcome to Shopnest!", message);
             res.status(201).json({ 
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
               
              });
        }else{
            res.status(400).json({ message: "Invalid user data" });
        }


    } catch (error) {
        res.status(500).json({ message: "Server error" });
    } 
};


const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: "Invalid credentials" });
        }
    }
        catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
const getUser = async (req, res) => {
    try {
        const user = await User.find({}).select("-password");
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
module.exports = { registerUser, loginUser, getUser };

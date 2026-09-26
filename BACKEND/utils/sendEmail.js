const nodemailer = require("nodemailer");
const sendEmail = async (to, subject, message) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",   
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    }); 
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to, 
        subject,
        text: message
    };
    await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending email:", error);
    }
    console.log("Email sent successfully");
    };
    module.exports = sendEmail;
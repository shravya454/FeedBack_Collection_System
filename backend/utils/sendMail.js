const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendOTP = async (email, otp, isReset = false) => {
    const subject = isReset ? "Your Password Reset OTP" : "Your OTP for Verification";
    const text = isReset 
        ? `You requested a password reset. Your OTP is ${otp}. This OTP is valid for 5 minutes.`
        : `Your OTP for registration is ${otp}. This OTP is valid for 5 minutes.`;

    const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        text
    });

    console.log("EMAIL SENT SUCCESSFULLY:", info.response);
    return info;
};

module.exports = sendOTP;
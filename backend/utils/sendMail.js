const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000
});

transporter.verify((error, success) => {
    if (error) console.log("SMTP verify failed:", error);
    else console.log("SMTP is ready");
});

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

const sendOTP = async (email, otp, isReset = false) => {
    try {
        const subject = isReset
            ? "Your Password Reset OTP"
            : "Your OTP for Verification";

        const text = isReset
            ? `Your password reset OTP is ${otp}. Valid for 5 minutes.`
            : `Your registration OTP is ${otp}. Valid for 5 minutes.`;

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject,
            text
        });

        console.log("📧 OTP SENT:", info.response);
        return info;
    } catch (error) {
        console.log("❌ EMAIL FAILED:", error);
        throw new Error("Failed to send OTP email");
    }
};

module.exports = sendOTP;
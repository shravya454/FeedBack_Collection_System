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

const sendOTP = async (email, payload, mode = 'otp') => {
    try {
        let subject, text;

        if (mode === 'reset') {
            subject = 'Your Password Reset OTP';
            text = `Your password reset OTP is ${payload}. Valid for 5 minutes.`;
        } else if (mode === 'reply') {
            subject = '📬 Admin has replied to your feedback';
            text = `Hello,\n\nAn admin has replied to your feedback:\n\n"${payload}"\n\nLog in to view the full conversation:\nhttp://localhost:5000/userFeedback.html\n\n— Feedback Collection System`;
        } else {
            subject = 'Your OTP for Verification';
            text = `Your registration OTP is ${payload}. Valid for 5 minutes.`;
        }

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject,
            text
        });

        console.log("📧 MAIL SENT:", info.response);
        return info;
    } catch (error) {
        console.log("❌ EMAIL FAILED:", error);
        throw new Error("Failed to send email");
    }
};

module.exports = sendOTP;
const sendOTP = require('../utils/sendMail');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async(req, res) => {
    let newUser = null;
    try {
        const { name, email, password, role, sector } = req.body;
        const normalizedEmail = email?.trim().toLowerCase();

        if (!normalizedEmail) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }

        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log("OTP GENERATED:", otp);
        console.log("SENDING TO:", normalizedEmail);
        const hashedPassword = await bcrypt.hash(password, 10);
        newUser = new User({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            role,
            sector,
            otp,
            otpExpires: new Date(Date.now() + 5 * 60 * 1000)
        });

        await newUser.save();
        
        try {
            await sendOTP(normalizedEmail, otp);
        } catch (emailError) {
            console.error("Failed to send OTP email, deleting created user:", emailError);
            await User.deleteOne({ _id: newUser._id });
            return res.status(500).json({ message: 'Failed to send OTP email. Please double check your email address.' });
        }

        res.json({ message: 'OTP sent to your email. Please verify.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.loginUser = async(req, res) => {
    try {
        const { email, password, role: expectedRole } = req.body;
        const normalizedEmail = email?.trim().toLowerCase();

        if (!normalizedEmail) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }

        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(400).json({ message: 'Email is not registered' });
        }

        if (expectedRole && user.role !== expectedRole) {
            const message = expectedRole === 'admin'
                ? 'This account is a user. Please login in the user page.'
                : 'This account is an admin. Please login in the admin page.';
            return res.status(400).json({ message });
        }

        if (user.otp && user.otp !== '') {
            return res.status(400).json({
                message: 'Please verify your email first'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Wrong password' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'secretkey',
            { expiresIn: '1d' }
        );

        res.json({
            message: 'Login Successful',
            token,
            role: user.role,
            name: user.name,
            email: user.email,
            sector: user.sector || ''
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.verifyOTP = async(req,res)=>{

    try{

        const { email, otp } = req.body;

        const user = await User.findOne({

            email: email?.toLowerCase()
        });

        if(!user){

            return res.status(400).json({

                message:'User not found'

            });

        }

        if(user.otp !== otp){

            return res.status(400).json({

                message:'Invalid OTP'

            });

        }

        if(new Date() > user.otpExpires){

            return res.status(400).json({

                message:'OTP Expired'

            });

        }

        user.otp='';

        user.otpExpires=null;

        await user.save();

        res.json({

            message:'Email Verified Successfully'

        });

    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};

exports.resendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const normalizedEmail = email?.trim().toLowerCase();

        if (!normalizedEmail) {
            return res.status(400).json({ message: 'Please provide a valid email address.' });
        }

        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);

        await user.save();

        try {
            await sendOTP(normalizedEmail, otp);
        } catch (emailError) {
            console.error("Failed to resend OTP email:", emailError);
            return res.status(500).json({ message: 'Failed to send OTP email. Please try again.' });
        }

        res.json({ message: 'A new OTP has been sent to your email.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const normalizedEmail = email?.trim().toLowerCase();

        if (!normalizedEmail) {
            return res.status(400).json({ message: 'Please provide a valid email address.' });
        }

        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);

        await user.save();

        try {
            await sendOTP(normalizedEmail, otp, true);
        } catch (emailError) {
            console.error("Failed to send Password Reset OTP email:", emailError);
            return res.status(500).json({ message: 'Failed to send OTP email. Please try again.' });
        }

        res.json({ message: 'OTP sent to your email. Please verify.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const normalizedEmail = email?.trim().toLowerCase();

        if (!normalizedEmail || !otp || !newPassword) {
            return res.status(400).json({ message: 'All fields (email, OTP, and new password) are required.' });
        }

        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (!user.otp || user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP.' });
        }

        if (new Date() > user.otpExpires) {
            return res.status(400).json({ message: 'OTP has expired.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.otp = '';
        user.otpExpires = null;

        await user.save();

        res.json({ message: 'Password reset successfully. You can now log in.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.testMail = async(req, res)=>{
    try{
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await sendOTP('feedbackportal4@gmail.com', otp);
        res.json({ message:'OTP Sent Successfully' });
    } catch(error){
        res.status(500).json({ message:error.message });
    }
};
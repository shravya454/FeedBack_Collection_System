const Feedback = require('../models/Feedback');
const User = require('../models/User');
const sendMail = require('../utils/sendMail');

exports.submitFeedback = async(req,res)=>{
    try{
        const {
            userName,
            userEmail,
            feedback,
            category,
            adminEmail,
            rating
        } = req.body;

        const adminUser = await User.findOne({ email: adminEmail, role: 'admin' });

        if (!adminUser) {
            return res.status(400).json({
                message: 'Admin email is not registered'
            });
        }

        if (adminUser.sector !== category) {
            return res.status(400).json({
                message: 'Category is wrong for the selected admin'
            });
        }

        const adminName = adminUser.name;

        const newFeedback = new Feedback({
            userName,
            userEmail,
            feedback,
            category,
            adminEmail,
            adminName,
            rating
        });

        await newFeedback.save();

        res.json({
            message: 'Feedback Submitted Successfully'
        });
    }
    catch(error){
        res.json({
            message:error.message
        });
    }
};

exports.getAllFeedback = async(req,res)=>{
    try{
        const feedbacks = await Feedback.find();
        res.json(feedbacks);
    }
    catch(error){
        res.json({
            message:error.message
        });
    }
};

exports.getUserFeedback = async(req,res)=>{
    try{
        const feedbacks = await Feedback.find({ userEmail: req.params.email });
        res.json(feedbacks);
    }
    catch(error){
        res.json({
            message:error.message
        });
    }
};

exports.replyToFeedback = async(req,res)=>{
    try{
        const { reply } = req.body;
        const updatedFeedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            { $push: { replies: { text: reply, sentAt: new Date() } } },
            { new:true }
        );

        // Send email notification to user
        if(updatedFeedback && updatedFeedback.userEmail){
            try{
                await sendMail(updatedFeedback.userEmail, reply, 'reply');
            } catch(mailErr){
                console.warn('Reply email failed (non-blocking):', mailErr.message);
            }
        }

        res.json({
            message:'Reply Added Successfully',
            updatedFeedback
        });
    }
    catch(error){
        res.json({
            message:error.message
        });
    }
};

exports.deleteFeedback = async(req,res)=>{
    try{
        await Feedback.findByIdAndDelete(req.params.id);
        res.json({ message:'Feedback deleted successfully' });
    }
    catch(error){
        res.json({ message:error.message });
    }
};

exports.editFeedback = async(req,res)=>{
    try{
        const { feedback } = req.body;
        const updated = await Feedback.findByIdAndUpdate(
            req.params.id,
            { feedback },
            { new:true }
        );
        res.json({ message:'Feedback updated', updated });
    }
    catch(error){
        res.json({ message:error.message });
    }
};

exports.editReply = async(req,res)=>{
    try{
        const { text } = req.body;
        const { id, replyIndex } = req.params;
        const idx = parseInt(replyIndex, 10);
        const update = {};
        update[`replies.${idx}.text`] = text;
        const updated = await Feedback.findByIdAndUpdate(
            id,
            { $set: update },
            { new:true }
        );
        res.json({ message:'Reply updated', updated });
    }
    catch(error){
        res.json({ message:error.message });
    }
};
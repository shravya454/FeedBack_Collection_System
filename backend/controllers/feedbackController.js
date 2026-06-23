const Feedback = require('../models/Feedback');
const User = require('../models/User');

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
            { reply },
            { new:true }
        );
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
const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    userEmail:{
        type:String,
        required:true
    },
    feedback:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    adminEmail:{
        type:String,
        required:true
    },
    adminName:{
        type:String,
        default:''
    },
    rating:{
        type:Number,
        required:true
    },
    replies:{
        type:[
            {
                text:{ type:String, required:true },
                sentAt:{ type:Date, default:Date.now }
            }
        ],
        default:[]
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
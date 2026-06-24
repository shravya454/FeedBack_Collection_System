const express = require('express');

const router = express.Router();

const {

    submitFeedback,
    getAllFeedback,
    getUserFeedback,
    replyToFeedback,
    deleteFeedback,
    editFeedback,
    editReply

} = require('../controllers/feedbackController');

router.post('/submit', submitFeedback);

router.get('/all', getAllFeedback);

router.get('/user/:email', getUserFeedback);

router.get('/admin/:email', async(req,res)=>{

    try{

        const Feedback = require('../models/Feedback');

        const feedbacks = await Feedback.find({

            adminEmail:req.params.email

        });

        res.json(feedbacks);

    }

    catch(error){

        res.json({
            message:error.message
        });

    }

});

router.put('/reply/:id', replyToFeedback);
router.delete('/:id', deleteFeedback);
router.put('/edit/:id', editFeedback);
router.put('/reply-edit/:id/:replyIndex', editReply);

module.exports = router;

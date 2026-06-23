const mongoose = require('mongoose');
const User = require('../backend/models/User');

const email = process.argv[2] || 'admin_test@example.com';

(async function(){
  try{
    await mongoose.connect('mongodb://127.0.0.1:27017/feedbackDB');
    const user = await User.findOne({ email: email }).lean();
    if(!user){
      console.log('User not found:', email);
    } else {
      console.log('Found user:');
      console.log(JSON.stringify(user, null, 2));
    }
    process.exit(0);
  } catch(err){
    console.error(err);
    process.exit(1);
  }
})();

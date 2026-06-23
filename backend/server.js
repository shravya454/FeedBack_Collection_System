require('dotenv').config();

const path = require('path');
const express = require('express');

const cors = require('cors');

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');

const feedbackRoutes = require('./routes/feedbackRoutes');

const app = express();

app.use(express.json());

app.use(cors());

app.use(express.static(path.join(__dirname, '..', 'frontend')));

connectDB();

app.use('/auth', authRoutes);

app.use('/feedback', feedbackRoutes);

app.get('/', (req,res)=>{
    res.send('Feedback Collection System Running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});
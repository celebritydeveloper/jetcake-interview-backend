const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');


// Configure Dotenv
dotenv.config();

// Connect to Database
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => console.log('Connected to DB'));

// Middleware
app.use(express.json());

// Import Routes 
const authRoute = require('./routes/auth');
const privateRoute = require('./routes/privateRoute');

// Import Middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', privateRoute);



const port = process.env.PORT || 3000;

app.listen(port, () => console.log('App is running on port ' + port));
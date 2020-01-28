const router = require('express').Router();
const User = require('../models/User');
// Import validation file
const {registerValidation, loginValidation} = require('../validation');
// Import Bcrypt for hashing password
const bcrypt = require('bcryptjs');
// Assign token to user with JWT
const jwt = require('jsonwebtoken');






router.post('/register', async (req, res) => {
    // Validate Inputs

    const { error } = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);


    // Check if Email already exists
    const emailExists = await User.findOne({email: req.body.email});
    if (emailExists) return res.status(400).send('Email Already Exists');

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);


    // Save new user into database
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    try {
        const savedUser = await user.save();
        res.send({user: user._id});
    } catch (error) {
        res.status(400).send(error);
    }
});


// Login in user Route
router.post('/login', async (req, res) => {
    // Valid the input field 
    const { error } = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // Check if email exists 
    const user = await User.findOne({ email: req.body.email});
    if(!user) return res.status(400).send('Email is wrong');

    const validatePassword = await bcrypt.compare(req.body.password, user.password);
    if(!validatePassword) return res.status(400).send('Invalid Password');

    // Assign Toke to users
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);


    res.send('Logged in Successfully');
});

module.exports = router;
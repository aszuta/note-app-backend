const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const { guard } = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

router.post('/register', async (req,res,next) => {
    try{
        const existUser = await User.findOne({ email: req.body.email });
        if(existUser){
            const error = new Error('Email already exist');
            res.status(409).json(error);
            error.status(409);
            throw error;
        }

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });

        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);

        const result = await user.save();
        res.status(200).json({
            message: 'User created',
            user: { id: result._id, email: result.email }
        });
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
});

router.post('/login', async (req,res,next) => {
    console.log('dupa1');
    try{
        let user = await User.findOne({ email: req.body.email });
        console.log('dupa2');
        if(!user){
            const error = new Error('User not found');
            error.statusCode = 401;
            throw error;
        }
        console.log('dupa3');

        const comparePassword = bcrypt.compareSync(req.body.password, user.password);
        console.log('dupa4');
        if(!comparePassword){
            const error = new Error('Password is incorrect');
            error.statusCode = 401;
            throw error;
        }
        console.log('dupa5');
        
        const token = jwt.sign({ _id: user._id }, `${process.env.JWT_SECRET_KEY}`);
        res.status(200).json({ token: token });
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
});

router.get('/me', guard, async (req,res,next) => {
    const user = await User.findById(req.user._id);
    res.send(user);
});

module.exports = router;
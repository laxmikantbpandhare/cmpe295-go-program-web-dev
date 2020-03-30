var express = require('express');
var router = express.Router();
const queries = require('../utils/queries');
const encrypt = require('../utils/encrypt');
var jwt = require("jsonwebtoken");
const {secret} = require('../config/config');

router.post('/signup',function(req,res){
    console.log("Inside User signup Post Request");
    console.log("Req Body : ",req.body);
    const user = req.body;

    encrypt.generateHash(user.password, hash => {
        queries.createUser(user,hash, result => {
            console.log("User created with id: " + result._id);
            res.status(200).send({success: true, message:'User created'});
        }, err => {
            if(err.code === 11000){
                res.status(401).send({ success: false, message: 'User with same SJSU Id/Email Id already exists.' });
            }else{
                res.status(500).send({ success: false, message: `Something failed when inserting record. ${err}`});
            }
        });
    }, err => {
        res.status(500).send({ success: false, error: 'Something failed when generating hash' });
    });
});

router.post('/login',function(req,res){
    console.log("Inside User Login Post Request");
    console.log("Req Body : ",req.body);

    const id = req.body.id;
    const password = req.body.password;

    queries.getUserPasswordById(id, row => {
        if(row){
            encrypt.confirmPassword(password,row.password, result => {
                if (result){
                    let user = {
                        email: row.email,
                        id: row.id,
                    }
                    var token = jwt.sign(user, secret, {
                        expiresIn: 10080 // in seconds
                    });
                    res.status(200).json({success: true, message: "Login successful", fname: row.fname, userType: row.userType, token: token});
                }else{
                    res.status(401).json({success: false, message: "Incorrect Password"});
                }
            }, err => {
                res.status(500).json({success: false, message: "Something wrong with bcrypt"});
            });
        }else{
            res.status(401).json({success: false, message: "User does not exists. Please try again"});
        }
    }, err => {
        res.status(500).json({success: false, message: "Something wrong when reading the record"});
    });
});

module.exports = router;
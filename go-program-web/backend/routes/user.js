var express = require('express');
var router = express.Router();
const queries = require('../utils/queries');
const encrypt = require('../utils/encrypt');
var jwt = require("jsonwebtoken");
const {secret} = require('../config/config');
var passport = require("passport");

router.post('/signup',function(req,res){
    console.log("Inside User signup Post Request");
    console.log("Req Body : ",req.body);
    const user = req.body;

    encrypt.generateHash(user.password, hash => {
        queries.createStudent(user, hash, result => {
            console.log("User created with id: " + result._id);
            res.status(200).json({message:'User created'});
        }, (err, tag) => {
            if(err.code === 11000){
                res.status(401).json({message: 'User with same SJSU Id/Email Id already exists.' });
            }else{
                res.status(500).json({message: `Something failed when inserting user in the ${tag} collection in the DB. ${err}`});
            }
        });
    }, err => {
        res.status(500).json({error: `Something failed when generating hash. ${err}` });
    });
});

router.post('/createAdmin', passport.authenticate("jwt", { session: false }), function(req, res){
    console.log("Inside User Create Admin Post Request");

    const user = req.body;
    const randomPassword = Math.random().toString(36).slice(-8);
    console.log('random password = ', randomPassword);

    encrypt.generateHash(randomPassword, hash => {
        queries.createAdmin(user, hash, result => {
            console.log("User created with id: " + result._id);

            // We don't need to send password ever over the network,
            // so convert mongoose Object to JS Object and remove password
            const resultObject = { ...result.toObject() };
            const {password, ...admin} = resultObject;
            admin._id = admin._id.toString();
            res.status(200).json({message:'User created', admin});
        }, err => {
            if(err.code === 11000){
                res.status(401).json({message: 'User with same SJSU Id/Email Id already exists.' });
            }else{
                res.status(500).json({message: `Something failed when inserting user in the DB. ${err}`});
            }
        });
    }, err => {
        res.status(500).json({error: `Something failed when generating hash. ${err}` });
    });
})

router.get('/allStudents',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside User All Students Get Request");
    
    queries.getAllStudents(students => {
        res.status(200).json({students});
    }, err=> {
        res.status(500).json({ message: `Something failed when getting students from the database. ${err.message}`});
    });
});

router.get('/allAdmins',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside User All Admins Get Request");
    
    queries.getAllAdmins(admins => {
        res.status(200).json({admins});
    }, err=> {
        res.status(500).json({ message: `Something failed when getting admins from the database. ${err.message}`});
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
                        id: id
                    }
                    var token = jwt.sign(user, secret, {
                        expiresIn: 100800 // in seconds
                    });
                    if(row.status === "Active"){
                        res.status(200).json({success: true, message: "Login successful", user: {userType: row.userType, fname: row.fname}, token: token});
                    } else {
                        res.status(401).json({success: false, message: "The user is Inactive. Please wait for the Admin to verify your Identity. If you feel it is taking too long, please contact the administration."});
                    }
                }else{
                    res.status(401).json({success: false, message: "Incorrect Password"});
                }
            }, err => {
                res.status(500).json({success: false, message: `Something wrong with bcrypt. ${err}`});
            });
        }else{
            res.status(401).json({success: false, message: "User does not exists. Please try again"});
        }
    }, err => {
        res.status(500).json({success: false, message: `Something wrong when reading the record from the database. ${err}`});
    });
});

router.post('/updateStatus', passport.authenticate("jwt", { session: false }), function(req,res){
    console.log("Inside User Update  Status Post Request");
    console.log("Req Body : ",req.body);
    const user = req.body;

    const id = getId(req.headers.authorization);

    user.updatedBy = id;

    queries.updateUserStatus(user, result => {
        // We don't need to send password ever over the network,
        // so convert mongoose Object to JS Object and remove password
        const resultObject = { ...result.toObject() };
        const {password, ...updatedUser} = resultObject;
        updatedUser._id = updatedUser._id.toString();
        res.status(200).json({message:`User's status updated successfully`, user: updatedUser});
    }, message =>{
        res.status(500).json({ message });
    });
});

router.post('/updateAdmin', passport.authenticate("jwt", { session: false }), function(req,res){
    console.log("Inside User Update Admin Post Request");
    console.log("Req Body : ",req.body);
    const user = req.body;

    queries.updateAdmin(user, result => {
        // We don't need to send password ever over the network,
        // so convert mongoose Object to JS Object and remove password
        const resultObject = { ...result.toObject() };
        const {password, ...updatedUser} = resultObject;
        updatedUser._id = updatedUser._id.toString();
        res.status(200).json({message:`Admin user updated successfully`, admin: updatedUser});
    }, message => {
        res.status(500).json({ message: `Something wrong when reading the record from the database. ${message}` });
    });
});

module.exports = router;
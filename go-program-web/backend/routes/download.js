const path = require('path');
var express = require('express');
var router = express.Router();
var passport = require("passport");

router.get('/image',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Download Image Get Request");
    
    res.sendFile(path.join(__dirname, `../uploads/${req.query.name}`), err => {
        if(err){
            res.status(500).send({ message: `Something failed when the server was sending item image. ${err.message}`});
        }
    });
});

router.get('/imageMob', function(req,res){
    console.log("Inside Download Image Get Request");

    res.sendFile(path.join(__dirname, `../uploads/${req.query.name}`), err => {
        if(err){
            res.status(500).send({ message: `Something failed when the server was sending item image. ${err.message}`});
        }
    });
});

module.exports = router;
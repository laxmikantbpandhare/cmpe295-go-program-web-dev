var express = require('express');
var router = express.Router();
const queries = require('../utils/queries');
var passport = require("passport");

router.get('/items',passport.authenticate("jwt", { session: false }),function(req,res){
// router.get('/items',function(req,res){
    console.log("Inside Admin Items Get Request");
    
    queries.getItems(items => {
        res.status(200).json({success: true, items: items});
    }, err=> {
        res.status(500).send({ message: `Something failed when getting items from the collection. ${err.message}`});
    });
});

router.post('/createItem', passport.authenticate("jwt", { session: false }), function(req,res){
    console.log("Inside Admin Create Item Post Request");
    console.log("Req Body : ",req.body);
    const item = req.body;

    queries.createItem(item, result => {
            console.log("Item created: " + result);
            res.status(200).send({message:'Item created successfully', item: result});
        }, err=>{
            if(err.code === 11000){
                res.status(401).send({ message: "Item with same name already exist in the inventory. Please change name and try again" });
            }else{
                res.status(500).send({ message: `Something failed when adding item in the collection. ${err.message}`});
        }
    });
});

router.post('/updateItem',passport.authenticate("jwt", { session: false }), function(req,res){
    console.log("Inside Admin Update Item Post Request");
    console.log("Req Body : ",req.body);
    const item = req.body;

    queries.updateItem(item, result => {
            res.status(200).send({message:'Item updated successfully'});
        }, err=>{
            if(err.code === 11000){
                res.status(401).send({ message: "Item with same name already exist in the inventory. Please change name and try again" });
            }else{
                res.status(500).send({ message: `Something failed when adding item in the collection. ${err.message}`});
        }
    });
});

module.exports = router;
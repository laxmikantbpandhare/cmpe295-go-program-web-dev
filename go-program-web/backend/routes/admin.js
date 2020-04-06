var express = require('express');
var router = express.Router();
const queries = require('../utils/queries');
var passport = require("passport");

router.get('/items',passport.authenticate("jwt", { session: false }),function(req,res){
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

router.post('/deleteItem',passport.authenticate("jwt", { session: false }), function(req,res){
    console.log("Inside Admin Delete Item Post Request");
    console.log("Req Body : ",req.body);
    const id = req.body.id;

    queries.deleteItem(id, result => {
            res.status(200).send({message:'Item deleted successfully'});
        }, err=>{
            res.status(500).send({ message: `Something failed when deleted item from the collection. ${err.message}`});
    });
});

router.get('/events',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Admin Events Get Request");
    
    queries.getEvents(events => {
        res.status(200).json({success: true, events: events});
    }, err=> {
        res.status(500).send({ message: `Something failed when getting events from the collection. ${err.message}`});
    });
});

router.post('/createEvent', passport.authenticate("jwt", { session: false }), function(req,res){
    console.log("Inside Admin Create Event Post Request");
    console.log("Req Body : ",req.body);
    const event = req.body;

    queries.createEvent(event, result => {
            console.log("Event created: " + result);
            res.status(200).send({message:'Event created successfully', event: result});
        }, err=>{
            if(err.code === 11000){
                res.status(401).send({ message: "Event with same name already exist. Please change name and try again" });
            }else{
                res.status(500).send({ message: `Something failed when adding event in the collection. ${err.message}`});
        }
    });
});

router.post('/updateEvent',passport.authenticate("jwt", { session: false }), function(req,res){
    console.log("Inside Admin Update Event Post Request");
    console.log("Req Body : ",req.body);
    const event = req.body;

    queries.updateEvent(event, result => {
            res.status(200).send({message:'Event updated successfully'});
        }, err=>{
            if(err.code === 11000){
                res.status(401).send({ message: "Event with same name already exist in the inventory. Please change name and try again" });
            }else{
                res.status(500).send({ message: `Something failed when adding event in the collection. ${err.message}`});
        }
    });
});

router.post('/deleteEvent',passport.authenticate("jwt", { session: false }), function(req,res){
    console.log("Inside Admin Delete Event Post Request");
    console.log("Req Body : ",req.body);
    const id = req.body.id;

    queries.deleteEvent(id, result => {
            res.status(200).send({message:'Event deleted successfully'});
        }, err=>{
            res.status(500).send({ message: `Something failed when deleted item from the collection. ${err.message}`});
    });
});

module.exports = router;
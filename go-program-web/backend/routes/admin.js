var express = require('express');
var router = express.Router();
const queries = require('../utils/queries');
var passport = require("passport");
const getId = require('../utils/getSjsuId');
const util = require('../utils/util');
const constants = require('../utils/constants');

router.get('/items',passport.authenticate("jwt", { session: false }),function(req,res){ 
    console.log("Inside Admin Items Get Request");

    if(!util.isUserStudentOrManagerOrAdmin(req.headers.authorization)){
        console.log("Access failure for Admin Items GET Request");
        return res.status(403).send({ message: constants.ACCESS_FAILURE_MSG});
    }
    
    queries.getItems(items => {
        res.status(200).json({success: true, items: items});
    }, err=> {
        res.status(500).send({ message: `Something failed when getting items from the collection. ${err.message}`});
    });
});

router.post('/createItem', passport.authenticate("jwt", { session: false }), function(req,res){
    console.log("Inside Admin Create Item Post Request");
    console.log("Req Body : ",req.body);

    if(!util.isUserManagerOrAdmin(req.headers.authorization)){
        console.log("Access failure for Admin Create Item POST Request");
        return res.status(403).send({ message: constants.ACTION_FAILURE_MSG});
    }

    const item = req.body;

    const id = getId(req.headers.authorization);
    
    item.createdBy = id;

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

    if(!util.isUserManagerOrAdmin(req.headers.authorization)){
        console.log("Access failure for Admin Update Item POST Request");
        return res.status(403).send({ message: constants.ACTION_FAILURE_MSG});
    }

    const item = req.body;

    const id = getId(req.headers.authorization);

    item.updatedBy = id;

    queries.updateItem(item, result => {
            res.status(200).send({message:'Item updated successfully', item: result});
        }, err=>{
            if(err.code === 11000){
                res.status(401).send({ message: "Item with same name already exist in the inventory. Please change name and try again" });
            }else{
                res.status(500).send({ message: `Something failed when adding item in the collection. ${err.message}`});
        }
    });
});

router.get('/events',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Admin Events Get Request");
    
    if(!util.isUserManagerOrAdmin(req.headers.authorization)){
        console.log("Access failure for Admin Events Item GET Request");
        return res.status(403).send({ message: constants.ACCESS_FAILURE_MSG});
    }
    
    queries.getEvents(events => {
        res.status(200).json({success: true, events: events});
    }, err=> {
        res.status(500).send({ message: `Something failed when getting events from the collection. ${err.message}`});
    });
});

router.get('/activeEvents',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Admin Active Events Get Request");
    
    if(!util.isUserStudentOrManagerOrAdmin(req.headers.authorization)){
        console.log("Access failure for Admin Active Events GET Request");
        return res.status(403).send({ message: constants.ACCESS_FAILURE_MSG});
    }

    queries.getActiveEvents(events => {
        res.status(200).json({success: true, events: events});
    }, err=> {
        res.status(500).send({ message: `Something failed when getting events from the collection. ${err.message}`});
    });
});

router.post('/createEvent', passport.authenticate("jwt", { session: false }), function(req,res){
    console.log("Inside Admin Create Event Post Request");
    console.log("Req Body : ",req.body);

    if(!util.isUserManagerOrAdmin(req.headers.authorization)){
        console.log("Access failure for Admin Create Event POST Request");
        return res.status(403).send({ message: constants.ACTION_FAILURE_MSG});
    }

    const event = req.body;

    const id = getId(req.headers.authorization);

    event.createdBy =  id;
    
    queries.createEvent(event, result => {
            console.log("Event created: " + result);
            res.status(200).send({message:'Event created successfully', event: result});
        }, err=>{
            if(err.code === 11000){
                res.status(401).send({ message: "Event with same name already exist. Please change name and try again" });
            }else{
                res.status(500).send({ message: `Something failed when adding event in the database. ${err.message}`});
        }
    });
});

router.post('/updateEvent',passport.authenticate("jwt", { session: false }), function(req,res){
    console.log("Inside Admin Update Event Post Request");
    console.log("Req Body : ",req.body);

    if(!util.isUserManagerOrAdmin(req.headers.authorization)){
        console.log("Access failure for Admin Update Event POST Request");
        return res.status(403).send({ message: constants.ACTION_FAILURE_MSG});
    }

    const event = req.body;

    const id = getId(req.headers.authorization);

    event.updatedBy = id;

    console.log("id",event.name)
    queries.updateEvent(event, result => {
            res.status(200).send({message:'Event updated successfully', event: result});
        }, err=>{
            if(err.code === 11000){
                res.status(401).send({ message: "Event with same name already exist in the inventory. Please change name and try again" });
            }else{
                res.status(500).send({ message: `Something failed when adding event in the database. ${err.message}`});
        }
    });
});

router.get('/item',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Admin Item Get Request");
    
    queries.getItem(req.query.id, item => {
        res.status(200).send({success: true, item: item});
    }, err=> {
        res.status(500).send({ message: `Something failed when getting the item from the collection. ${err.message}`});
    });
});

router.get('/specificOrder',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Admin Specific Order Get Request");

    if(!util.isUserManagerOrAdmin(req.headers.authorization)){
        console.log("Access failure for Admin Specific Order GET Request");
        return res.status(403).send({ message: constants.ACCESS_FAILURE_MSG});
    }
    
    queries.getOrderDetailsAdmin(req.query.orderId, order => {
        res.status(200).send({success: true, order: order});
    }, message=> {
        res.status(500).send({ message: message});
    });
});

router.get('/dashboardPendingApprovalEvents',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Admin Dashboard Pending Approval Events Get Request");
    
    if(!util.isUserManagerOrAdmin(req.headers.authorization)){
        console.log("Access failure for Admin Pending Approval Events GET Request");
        return res.status(403).send({ message: constants.ACCESS_FAILURE_MSG});
    }

    queries.getAdminDashboardPendingApprovalEvents(events => {
        res.status(200).json({success: true, events: events});
    }, err=> {
        res.status(500).send({ message: `Something failed when getting Students Events from the database. ${err.message}`});
    });
});

router.get('/dashboardSubmittedOrders',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Admin Dashboard Submitted Orders Get Request");
    
    if(!util.isUserManagerOrAdmin(req.headers.authorization)){
        console.log("Access failure for Admin Dashboard Submitted Orders GET Request");
        return res.status(403).send({ message: constants.ACCESS_FAILURE_MSG});
    }

    queries.getAdminDashboardSubmittedOrders(orders => {
        res.status(200).json({success: true, orders: orders});
    }, err => {
        res.status(500).send({ message: `Something failed when getting Students Orders from the database. ${err.message}`});
    });
});

router.get('/dashboardPendingApprovalSuggestedEvents',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Admin Dashboard Pending Approval Suggested Events Get Request");
    
    if(!util.isUserManagerOrAdmin(req.headers.authorization)){
        console.log("Access failure for Admin Dashboard Dashboard Pending Approval Suggested Events GET Request");
        return res.status(403).send({ message: constants.ACCESS_FAILURE_MSG});
    }

    queries.getAdminDashboardPendingApprovalSuggestedEvents(events => {
        res.status(200).json({success: true, events: events});
    }, err=> {
        res.status(500).send({ message: `Something failed when getting Students Events from the database. ${err.message}`});
    });
});

module.exports = router;
var express = require('express');
var router = express.Router();
const queries = require('../utils/queries');
var passport = require("passport");

router.get('/ownEvents',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Student Own Events Get Request");
    
    queries.getStudentOwnEvents(req.query.id,events => {
        res.status(200).json({success: true, events: events});
    }, (err,tag)=> {
        res.status(500).send({ message: `Something failed when getting ${tag} from the database. ${err.message}`});
    });
});

router.post('/createEvent', passport.authenticate("jwt", { session: false }), function(req,res){
    console.log("Inside Student Create Event Post Request");
    console.log("Req Body : ",req.body);
    const event = req.body;

    queries.createStudentEvent(event, result => {
            console.log("Event created: " + result);
            res.status(200).send({message:'Student event created successfully', event: result});
        }, (err, tag)=>{
            console.log("Errored out---",err.message)
            if(err.code === 11000){
                res.status(401).send({ message: "You have already submitted this event. Please contact admin." });
            }else{
                res.status(500).send({ message: `Something failed when adding ${tag} in the database. ${err.message}`});
        }
    });
});

router.get('/allEvents',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Student Requests All Events Get Request");
    
    queries.getStudentsAllEvents(events => {
        res.status(200).json({success: true, events: events});
    }, err=> {
        res.status(500).send({ message: `Something failed when getting students events from the database. ${err.message}`});
    });
});

router.post('/updateEventStatus', passport.authenticate("jwt", { session: false }), function(req,res){
    console.log("Inside Student Update Event Status Post Request");
    console.log("Req Body : ",req.body);
    const event = req.body;

    queries.updateStudentEventStatus(event, result => {
        console.log("Event updated: " + result);
        res.status(200).send({message:'Student event status updated successfully', event: result});
    }, message =>{
        res.status(500).send({ message });
    });
});

router.post('/updateEvent', passport.authenticate("jwt", { session: false }), function(req,res){
    console.log("Inside Student Update Event Post Request");
    console.log("Req Body : ",req.body);
    const event = req.body;

    queries.updateStudentEvent(event, result => {
        res.status(200).send({message:'Event updated successfully', event: result});
    }, message =>{
        res.status(500).send({ message });
    });
});

router.get('/points',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Student Points Get Request");
    
    queries.getStudentPoints(req.query.id, (pointsAccumulated, pointsSpent) => {
        res.status(200).json({success: true, pointsAccumulated, pointsSpent});
    }, err=> {
        res.status(500).send({ message: `Something failed when getting students events from the database. ${err.message}`});
    });
});

router.post('/addEventComment',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Student Add Event Comment Post Request");
    console.log("Req Body : ",req.body);
    const comment = req.body.comment;
    const eventId = req.body.id;

    queries.addStudentEventComment(eventId, comment, result => {
        res.status(200).json({message:'Comment added successfully', event: result});
    }, err=> {
        res.status(500).send({ message: `Something failed when adding comments in the student event in the database. ${err.message}`});
    });
});

router.post('/createOrder', passport.authenticate("jwt", { session: false }), function(req,res){
    console.log("Inside Student Create Order Post Request");
    console.log("Req Body : ",req.body);
    const order = req.body;

    queries.createOrder(order, result => {
        res.status(200).send({message:`Student order created successfully. Order Id# ${result.id}`});
    }, message =>{
        res.status(500).send({ message });
    });
});

router.get('/ownOrders',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Student Own Orders Get Request");
    
    queries.getStudentOwnOrders(req.query.id,orders => {
        res.status(200).json({success: true, orders: orders});
    }, (err,tag)=> {
        res.status(500).send({ message: `Something failed when getting ${tag} from the database. ${err.message}`});
    });
});

router.post('/addOrderComment',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Student Add Order Comment Post Request");
    console.log("Req Body : ",req.body);
    const comment = req.body.comment;
    const orderId = req.body.id;

    queries.addStudentOrderComment(orderId, comment, result => {
        res.status(200).json({message:'Comment added successfully', order: result});
    }, err=> {
        res.status(500).send({ message: `Something failed when adding comments in the order collection in the database. ${err.message}`});
    });
});

router.get('/allOrders',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Student Requests All Orders Get Request");
    
    queries.getStudentsAllOrders(orders => {
        res.status(200).json({success: true, orders: orders});
    }, err=> {
        res.status(500).send({ message: `Something failed when getting students orders from the database. ${err.message}`});
    });
});

router.post('/updateOrderStatus', passport.authenticate("jwt", { session: false }), function(req,res){
    console.log("Inside Student Update Order Status Post Request");
    console.log("Req Body : ",req.body);
    const order = req.body;

    queries.updateStudentOrderStatus(order, result => {
        console.log("Order updated: " + result);
        res.status(200).send({message:'Student order status updated successfully', order: result});
    }, message =>{
        res.status(500).send({ message });
    });
});

router.get('/specificOrder',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Student Specific Order Get Request");
    
    queries.getOrderDetailsStudent(req.query.orderId, req.query.studentId, order => {
        res.status(200).send({success: true, order: order});
    }, message=> {
        res.status(500).send({ message: message});
    });
});

router.get('/dashboardEvents',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Student Dashboard Events Get Request");
    
    queries.getStudentDashboardEvents(req.query.id,events => {
        res.status(200).json({success: true, events: events});
    }, (err,tag)=> {
        res.status(500).send({ message: `Something failed when getting ${tag} from the database. ${err.message}`});
    });
});

router.get('/dashboardApprovedEvents',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Student Dashboard Approved Events Get Request");
    
    queries.getStudentDashboardApprovedEvents(req.query.id,events => {
        res.status(200).json({success: true, events: events});
    }, (err,tag)=> {
        res.status(500).send({ message: `Something failed when getting ${tag} from the database. ${err.message}`});
    });
});

router.get('/dashboardOrders',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Student Dashboard Orders Get Request");
    
    queries.getStudentDashboardOrders(req.query.id,orders => {
        res.status(200).json({success: true, orders: orders});
    }, (err,tag)=> {
        res.status(500).send({ message: `Something failed when getting ${tag} from the database. ${err.message}`});
    });
});

router.get('/dashboardDeliveredOrders',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Student Dashboard Delivered Orders Get Request");
    
    queries.getStudentDashboardDeliveredOrders(req.query.id,orders => {
        res.status(200).json({success: true, orders: orders});
    }, (err,tag)=> {
        res.status(500).send({ message: `Something failed when getting ${tag} from the database. ${err.message}`});
    });
});

module.exports = router;
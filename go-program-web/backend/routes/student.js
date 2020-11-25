var express = require('express');
var router = express.Router();
const queries = require('../utils/queries');
var passport = require("passport");
const getId = require('../utils/getSjsuId');
const {sendMail} = require('../config/email');

router.get('/ownEvents',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Student Own Events Get Request");

    const id = getId(req.headers.authorization);

    queries.getStudentOwnEvents(id,events => {
        res.status(200).json({success: true, events: events});
    }, (err,tag)=> {
        res.status(500).send({ message: `Something failed when getting ${tag} from the database. ${err.message}`});
    });
});

router.post('/createEvent', passport.authenticate("jwt", { session: false }), function(req,res){
    console.log("Inside Student Create Event Post Request");
    console.log("Req Body : ",req.body);
    const event = req.body;

    const id = getId(req.headers.authorization);

    event.student.id = id;
    
    queries.createStudentEvent(event, result => {
        console.log("Event created: " + result);

        // queries.getUserPasswordById(id, row => {
        //     console.log(row);

            sendMail("Student Event Submission on GO Program.", 
                     '<h2>Student with id '+id+' submitted the event on GO Program.</h2>'+
                     '<h2>Please visit GO Application for further action on the submitted event.</h2>'+
                     '<p>Thank You and Regards</p>'+
                     '<p>GO Program,</p>'+
                     '<p>San Jose State Universiry.</p>',
                     "coe-go-project-group@sjsu.edu");

        // })

        res.status(200).send({message:'Student event created successfully', event: result});
    }, (err, tag)=>{
        if(err.code === 11000){
            res.status(401).send({ message: "You have already submitted this event. Please wait till it is approved or contact admin." });
        }else{
            if(tag === "Student"){
                res.status(500).send({ message: `Something failed when getting ${tag} from the database. ${err.message}`});
            } else {
                res.status(500).send({ message: `Something failed when adding ${tag} in the database. ${err.message}`});
            }
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

    const id = getId(req.headers.authorization);

    event.updatedBy = id;
    
    queries.updateStudentEventStatus(event, result => {
        console.log("Event updated: " + result);
        console.log(result.student.user.email)
        
        // send email here
        sendMail("Student Submitted Event Update on GO Program.", 
                 '<h2>The Admin of SJSU GO Program updated your Event status to: '+event.status+'</h2>'+
                 '<h2>Please contact SJSU admin for any further queries.</h2>'+
                 '<p>Thank You and Regards</p>'+
                 '<p>GO Program,</p>'+
                 '<p>San Jose State University.</p>',
                 result.student.user.email);

        res.status(200).send({message:'Student event status updated successfully', event: result});
    }, message =>{
        res.status(500).send({ message });
    });
});

router.post('/updateEvent', passport.authenticate("jwt", { session: false }), function(req,res){
    console.log("Inside Student Update Event Post Request");
    console.log("Req Body : ",req.body);
    const event = req.body;

    const id = getId(req.headers.authorization);

    event.updatedBy = id;

    queries.updateStudentEvent(event, result => {
        res.status(200).send({message:'Event updated successfully', event: result});
    }, message =>{
        res.status(500).send({ message });
    });
});

router.get('/points',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Student Points Get Request");
    
    const id = getId(req.headers.authorization);

    queries.getStudentPoints(id, (pointsAccumulated, pointsSpent) => {
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

    const id = getId(req.headers.authorization);

    let commenter = `${comment.commenter}(${id})`
    comment.commenter =  commenter;

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

    const id = getId(req.headers.authorization);

    order.student.id = id;
    
    queries.createOrder(order, result => {

        sendMail("Student Order Submission on GO Program.", 
                '<h2>Student with id '+id+' submitted the Order on GO Program.</h2>'+
                '<h2>Please visit GO Application for further action on the submitted event.</h2>'+
                '<p>Thank You and Regards</p>'+
                '<p>GO Program,</p>'+
                '<p>San Jose State Universiry.</p>',
                "coe-go-project-group@sjsu.edu");

        res.status(200).send({message:`Student order created successfully. Order Id# ${result.id}`});
    }, message =>{
        res.status(500).send({ message });
    });
});

router.get('/ownOrders',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Student Own Orders Get Request");
    
    const id = getId(req.headers.authorization);

    queries.getStudentOwnOrders(id,orders => {
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

    const id = getId(req.headers.authorization);

    let commenter = `${comment.commenter}(${id})`
    comment.commenter =  commenter;

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

    const id = getId(req.headers.authorization);
    
    order.updatedBy = id;

    queries.updateStudentOrderStatus(order, result => {
        console.log("Order updated: " + result);
        res.status(200).send({message:'Student order status updated successfully', order: result});
    }, message =>{
        res.status(500).send({ message });
    });
});

router.get('/specificOrder',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Student Specific Order Get Request");
    
    const id = getId(req.headers.authorization);
    
    queries.getOrderDetailsStudent(req.query.orderId, id, order => {
        res.status(200).send({success: true, order: order});
    }, message=> {
        res.status(500).send({ message: message});
    });
});

router.get('/dashboardEvents',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Student Dashboard Events Get Request");
    
    const id = getId(req.headers.authorization);

    queries.getStudentDashboardEvents(id,events => {
        res.status(200).json({success: true, events: events});
    }, (err,tag)=> {
        res.status(500).send({ message: `Something failed when getting ${tag} from the database. ${err.message}`});
    });
});

router.get('/dashboardApprovedEvents',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Student Dashboard Approved Events Get Request");
 
    const id = getId(req.headers.authorization);

    queries.getStudentDashboardApprovedEvents(id,events => {
        res.status(200).json({success: true, events: events});
    }, (err,tag)=> {
        res.status(500).send({ message: `Something failed when getting ${tag} from the database. ${err.message}`});
    });
});

router.get('/dashboardOrders',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Student Dashboard Orders Get Request");
    
    const id = getId(req.headers.authorization);

    queries.getStudentDashboardOrders(id,orders => {
        res.status(200).json({success: true, orders: orders});
    }, (err,tag)=> {
        res.status(500).send({ message: `Something failed when getting ${tag} from the database. ${err.message}`});
    });
});

router.get('/dashboardDeliveredOrders',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Student Dashboard Delivered Orders Get Request");
    
    const id = getId(req.headers.authorization);

    queries.getStudentDashboardDeliveredOrders(id,orders => {
        res.status(200).json({success: true, orders: orders});
    }, (err,tag)=> {
        res.status(500).send({ message: `Something failed when getting ${tag} from the database. ${err.message}`});
    });
});

router.post('/createSuggestedEvent', passport.authenticate("jwt", { session: false }), function(req,res){
    console.log("Inside Student Create Suggested Event Post Request");
    console.log("Req Body : ",req.body);
    const event = req.body;

    const id = getId(req.headers.authorization);

    event.student.id = id;

    queries.createSuggestedEvent(event, result => {

        sendMail("Student Suggested Event on GO Program.", 
                 '<h2>Student with id '+id+' suggested the Event on GO Program.</h2>'+
                 '<h2>Please visit GO Application for further action on the submitted event.</h2>'+
                 '<p>Thank You and Regards</p>'+
                 '<p>GO Program,</p>'+
                 '<p>San Jose State Universiry.</p>',
                 "coe-go-project-group@sjsu.edu");

        res.status(200).send({message:'Suggested event created successfully', event: result});
    }, (err, tag)=>{
        if(err.code === 11000){
            res.status(401).send({ message: "This event is already suggested. Please wait till it is approved or contact admin." });
        }else{
            if(tag === "Student"){
                res.status(500).send({ message: `Something failed when getting ${tag} from the database. ${err.message}`});
            } else {
                res.status(500).send({ message: `Something failed when adding ${tag} in the database. ${err.message}`});
            }
        }
    });
});

router.get('/ownSuggestedEvents',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Student Own Suggested Events Get Request");
    
    const id = getId(req.headers.authorization);

    queries.getStudentOwnSuggestedEvents(id,events => {
        res.status(200).json({success: true, events: events});
    }, (err,tag)=> {
        res.status(500).send({ message: `Something failed when getting ${tag} from the database. ${err.message}`});
    });
});

router.post('/addSuggestedEventComment',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Student Add Suggested Event Comment Post Request");
    console.log("Req Body : ",req.body);
    const comment = req.body.comment;
    const eventId = req.body.id;

    const id = getId(req.headers.authorization);

    let commenter = `${comment.commenter}(${id})`
    comment.commenter =  commenter;

    queries.addStudentSuggestedEventComment(eventId, comment, result => {
        res.status(200).json({message:'Comment added successfully', event: result});
    }, err=> {
        res.status(500).send({ message: `Something failed when adding comments in the suggested event in the database. ${err.message}`});
    });
});

router.get('/allSuggestedEvents',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Student Requests All Suggested Events Get Request");
    
    queries.getStudentsAllSuggestedEvents(events => {
        res.status(200).json({success: true, events: events});
    }, err=> {
        res.status(500).send({ message: `Something failed when getting suggested events from the database. ${err.message}`});
    });
});

router.post('/updateSuggestedEventStatus', passport.authenticate("jwt", { session: false }), function(req,res){
    console.log("Inside Student Update Suggested Event Status Post Request");
    console.log("Req Body : ",req.body);
    const event = req.body;

    const id = getId(req.headers.authorization);

    event.updatedBy = id;
    queries.updateStudentSuggestedEventStatus(event, result => {
        console.log("Event updated: " + result);
                // send email here
        sendMail("Student Suggested Event Update on GO Program.", 
                 '<h2>The Admin of SJSU GO Program updated your Suggested Event status to: '+event.status+'</h2>'+
                 '<h2>Please contact SJSU admin for any further queries.</h2>'+
                 '<p>Thank You and Regards</p>'+
                 '<p>GO Program Admin,</p>'+
                 '<p>San Jose State Universiry.</p>',
                 result.student.user.email);
        res.status(200).send({message:'Student suggested event status updated successfully', event: result});
    }, message =>{
        res.status(500).send({ message });
    });
});

router.get('/dashboardSuggestedEvents',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Student Dashboard Suggested Events Get Request");
    
    const id = getId(req.headers.authorization);

    queries.getStudentDashboardSuggestedEvents(id,events => {
        res.status(200).json({success: true, events: events});
    }, (err,tag)=> {
        res.status(500).send({ message: `Something failed when getting ${tag} from the database. ${err.message}`});
    });
});

router.get('/dashboardApprovedSuggestedEvents',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Student Dashboard Approved Suggested Events Get Request");
    
    const id = getId(req.headers.authorization);

    queries.getStudentDashboardApprovedSuggestedEvents(id,events => {
        res.status(200).json({success: true, events: events});
    }, (err,tag)=> {
        res.status(500).send({ message: `Something failed when getting ${tag} from the database. ${err.message}`});
    });
});

module.exports = router;
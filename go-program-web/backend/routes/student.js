var express = require('express');
var router = express.Router();
const queries = require('../utils/queries');
var passport = require("passport");
const getId = require('../utils/getSjsuId');
const {sendMail} = require('../utils/email');
const util = require('../utils/util');
const constants = require('../utils/constants');

router.get('/ownEvents',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Student Own Events Get Request");

    if(!util.isUserStudent(req.headers.authorization)){
        console.log("Access failure for Student Own Events GET Request");
        return res.status(403).send({ message: constants.ACCESS_FAILURE_MSG});
    }

    const id = getId(req.headers.authorization);

    queries.getStudentOwnEvents(id,events => {
        res.status(200).json({success: true, events: events});
    }, (err,tag)=> {
        res.status(500).send({ message: `Something failed when getting ${tag} from the database. ${err.message}`});
    });
});

router.post('/createEvent', passport.authenticate("jwt", { session: false }), function(req,res){
    console.log("Inside Student Create Event Post Request");

    if(!util.isUserStudent(req.headers.authorization)){
        console.log("Access failure for Student Create Events POST Request");
        return res.status(403).send({ message: constants.ACTION_FAILURE_MSG});
    }

    console.log("Req Body : ",req.body);
    const event = req.body;

    const id = getId(req.headers.authorization);

    event.student.id = id;
    
    queries.createStudentEvent(event, result => {
        console.log("Event created: " + result);

            const title = "Student submitted Event on GO Program";
            
            const emailBody =   '<div>Dear Admin,</div><br/>'+
                                '<div>Student with id '+id+' submitted the event on GO Program. </div><br/>'+
                                '<div>Please visit GO Program website for further action on the submitted event. </div><br/>'+
                                '<div>Thank You and Regards,</div>'+
                                '<div>The GO program</div>'+
                                '<div>Charles W. Davidson College of Engineering</div>'+
                                '<div>San José State University</div>';
                                   
            sendMail(title, 
                     emailBody,
                     "coe-go-project-group@sjsu.edu", messageInfo => {
                        res.status(200).send({message:'Student event created successfully', event: result});
                    }, err => {
                        res.status(500).json({message:`Failed to send an email. If still issue persists then contact GO Program admin. ${err}`});
                    }
            );

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

    if(!util.isUserStudentOrManagerOrAdmin(req.headers.authorization)){
        console.log("Access failure for Student Requests All Events GET Request");
        return res.status(403).send({ message: constants.ACTION_FAILURE_MSG});
    }
    
    queries.getStudentsAllEvents(events => {
        res.status(200).json({success: true, events: events});
    }, err=> {
        res.status(500).send({ message: `Something failed when getting students events from the database. ${err.message}`});
    });
});

router.post('/updateEventStatus', passport.authenticate("jwt", { session: false }), function(req,res){
    console.log("Inside Student Update Event Status Post Request");

    if(!util.isUserManagerOrAdmin(req.headers.authorization)){
        console.log("Access failure for Student Update Event Status POST Request");
        return res.status(403).send({ message: constants.ACTION_FAILURE_MSG});
    }

    console.log("Req Body : ",req.body);
    const event = req.body;

    const id = getId(req.headers.authorization);

    event.updatedBy = id;
    
    queries.updateStudentEventStatus(event, result => {
        console.log("Event updated: " + result);
        
        // send email here

        const title = "Student Submitted Event on GO Program";
            
        const emailBody =   '<div>Dear Student,</div><br/>'+
                            '<div>The Admin of SJSU GO Program updated your Event status to: <b>'+event.status+'</b></div><br/>'+
                            '<div>Please contact SJSU GO Program admin for any further queries.</div><br/>'+
                            '<div>Thank You and Regards,</div>'+
                            '<div>The GO program</div>'+
                            '<div>Charles W. Davidson College of Engineering</div>'+
                            '<div>San José State University</div>';
                                        
        sendMail(title, 
                 emailBody,
                 result.student.user.email, messageInfo => {
                    res.status(200).send({message:'Student event status updated successfully', event: result});
                }, err => {
                    res.status(500).json({message:`Failed to send an email. If still issue persists then contact GO Program admin. ${err}`});
                }
        );

    }, message =>{
        res.status(500).send({ message });
    });
});

router.post('/updateEvent', passport.authenticate("jwt", { session: false }), function(req,res){
    console.log("Inside Student Update Event Post Request");

    if(!util.isUserStudent(req.headers.authorization)){
        console.log("Access failure for Student Update Event POST Request");
        return res.status(403).send({ message: constants.ACTION_FAILURE_MSG});
    }

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
    
    if(!util.isUserStudent(req.headers.authorization)){
        console.log("Access failure for Student Points Event GET Request");
        return res.status(403).send({ message: constants.ACCESS_FAILURE_MSG});
    }

    const id = getId(req.headers.authorization);

    queries.getStudentPoints(id, (pointsAccumulated, pointsSpent) => {
        res.status(200).json({success: true, pointsAccumulated, pointsSpent});
    }, err=> {
        res.status(500).send({ message: `Something failed when getting students events from the database. ${err.message}`});
    });
});

router.post('/addEventComment',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Student Add Event Comment Post Request");

    if(!util.isUserStudentOrManagerOrAdmin(req.headers.authorization)){
        console.log("Access failure for Student Add Event Comment POST Request");
        return res.status(403).send({ message: constants.ACTION_FAILURE_MSG});
    }

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

    if(!util.isUserStudent(req.headers.authorization)){
        console.log("Access failure for Student Create Order POST Request");
        return res.status(403).send({ message: constants.ACTION_FAILURE_MSG});
    }

    console.log("Req Body : ",req.body);
    const order = req.body;

    const id = getId(req.headers.authorization);

    order.student.id = id;
    
    queries.createOrder(order, result => {

        const title = "Student Submitted Order on GO Program";
            
        const emailBody =   '<div>Dear Admin,</div><br/>'+
                            '<div>Student with id <b>'+id+'</b> submitted the Order on GO Program. </div><br/>'+
                            '<div>Please visit GO Program website for further action on the submitted order. </div><br/>'+
                            '<div>Thank You and Regards,</div>'+
                            '<div>The GO program</div>'+
                            '<div>Charles W. Davidson College of Engineering</div>'+
                            '<div>San José State University</div>';
                                       
        sendMail(title, 
                 emailBody,
                 "coe-go-project-group@sjsu.edu", messageInfo => {
                    res.status(200).send({message:`Student order created successfully. Order Id# ${result.id}`});
                }, err => {
                    res.status(500).json({message:`Failed to send an email. If still issue persists then contact GO Program admin. ${err}`});
                }
        );
    }, message =>{
        res.status(500).send({ message });
    });
});

router.get('/ownOrders',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Student Own Orders Get Request");
    
    if(!util.isUserStudent(req.headers.authorization)){
        console.log("Access failure for Student Own Orders GET Request");
        return res.status(403).send({ message: constants.ACCESS_FAILURE_MSG});
    }

    const id = getId(req.headers.authorization);

    queries.getStudentOwnOrders(id,orders => {
        res.status(200).json({success: true, orders: orders});
    }, (err,tag)=> {
        res.status(500).send({ message: `Something failed when getting ${tag} from the database. ${err.message}`});
    });
});

router.post('/addOrderComment',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Student Add Order Comment Post Request");

    if(!util.isUserStudentOrManagerOrAdmin(req.headers.authorization)){
        console.log("Access failure for Student Add Order Comment POST Request");
        return res.status(403).send({ message: constants.ACTION_FAILURE_MSG});
    }

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
    
    if(!util.isUserStudentOrManagerOrAdmin(req.headers.authorization)){
        console.log("Access failure for Student Requests All Orders GET Request");
        return res.status(403).send({ message: constants.ACCESS_FAILURE_MSG});
    }

    queries.getStudentsAllOrders(orders => {
        res.status(200).json({success: true, orders: orders});
    }, err=> {
        res.status(500).send({ message: `Something failed when getting students orders from the database. ${err.message}`});
    });
});

router.post('/updateOrderStatus', passport.authenticate("jwt", { session: false }), function(req,res){
    console.log("Inside Student Update Order Status Post Request");

    if(!util.isUserManagerOrAdmin(req.headers.authorization)){
        console.log("Access failure for Student Update Order Status POST Request");
        return res.status(403).send({ message: constants.ACTION_FAILURE_MSG});
    }

    console.log("Req Body : ",req.body);
    const order = req.body;

    const id = getId(req.headers.authorization);
    
    order.updatedBy = id;

    queries.updateStudentOrderStatus(order, result => {
        console.log("Order updated: " + result);

        const title = "Your Order status updated on GO Program";
            
        const emailBody =   '<div>Dear Student,</div><br/>'+
                            '<div>The Admin of SJSU GO Program updated your Order status to: <b>'+order.status+'</b></div><br/>'+
                            '<div>Please contact SJSU GO Program admin for any further queries.</div><br/>'+
                            '<div>Thank You and Regards,</div>'+
                            '<div>The GO program</div>'+
                            '<div>Charles W. Davidson College of Engineering</div>'+
                            '<div>San José State University</div>';
                                                 
        sendMail(title, 
                 emailBody,
                 result.student.user.email, messageInfo => {
                    res.status(200).send({message:'Student order status updated successfully', order: result});
                }, err => {
                    res.status(500).json({message:`Failed to send an email. If still issue persists then contact GO Program admin. ${err}`});
                }
        );

    }, message =>{
        res.status(500).send({ message });
    });
});

router.get('/specificOrder',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Student Specific Order Get Request");
    
    if(!util.isUserStudent(req.headers.authorization)){
        console.log("Access failure for Student Specific Order GET Request");
        return res.status(403).send({ message: constants.ACCESS_FAILURE_MSG});
    }

    const id = getId(req.headers.authorization);
    
    queries.getOrderDetailsStudent(req.query.orderId, id, order => {
        res.status(200).send({success: true, order: order});
    }, message=> {
        res.status(500).send({ message: message});
    });
});

router.get('/dashboardEvents',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Student Dashboard Events Get Request");
    
    if(!util.isUserStudent(req.headers.authorization)){
        console.log("Access failure for Student Dashboard Events GET Request");
        return res.status(403).send({ message: constants.ACCESS_FAILURE_MSG});
    }

    const id = getId(req.headers.authorization);

    queries.getStudentDashboardEvents(id,events => {
        res.status(200).json({success: true, events: events});
    }, (err,tag)=> {
        res.status(500).send({ message: `Something failed when getting ${tag} from the database. ${err.message}`});
    });
});

router.get('/dashboardApprovedEvents',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Student Dashboard Approved Events Get Request");
 
    if(!util.isUserStudent(req.headers.authorization)){
        console.log("Access failure for Student Dashboard Approved Events GET Request");
        return res.status(403).send({ message: constants.ACTION_FAILURE_MSG});
    }

    const id = getId(req.headers.authorization);

    queries.getStudentDashboardApprovedEvents(id,events => {
        res.status(200).json({success: true, events: events});
    }, (err,tag)=> {
        res.status(500).send({ message: `Something failed when getting ${tag} from the database. ${err.message}`});
    });
});

router.get('/dashboardOrders',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Student Dashboard Orders Get Request");
    
    if(!util.isUserStudent(req.headers.authorization)){
        console.log("Access failure for Student Dashboard Orders GET Request");
        return res.status(403).send({ message: constants.ACCESS_FAILURE_MSG});
    }

    const id = getId(req.headers.authorization);

    queries.getStudentDashboardOrders(id,orders => {
        res.status(200).json({success: true, orders: orders});
    }, (err,tag)=> {
        res.status(500).send({ message: `Something failed when getting ${tag} from the database. ${err.message}`});
    });
});

router.get('/dashboardDeliveredOrders',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Student Dashboard Delivered Orders Get Request");
    
    if(!util.isUserStudent(req.headers.authorization)){
        console.log("Access failure for Student Dashboard Delivered Orders POST Request");
        return res.status(403).send({ message: constants.ACTION_FAILURE_MSG});
    }

    const id = getId(req.headers.authorization);

    queries.getStudentDashboardDeliveredOrders(id,orders => {
        res.status(200).json({success: true, orders: orders});
    }, (err,tag)=> {
        res.status(500).send({ message: `Something failed when getting ${tag} from the database. ${err.message}`});
    });
});

router.post('/createSuggestedEvent', passport.authenticate("jwt", { session: false }), function(req,res){
    console.log("Inside Student Create Suggested Event Post Request");

    if(!util.isUserStudent(req.headers.authorization)){
        console.log("Access failure for Student Create Suggested Event POST Request");
        return res.status(403).send({ message: constants.ACTION_FAILURE_MSG});
    }

    console.log("Req Body : ",req.body);
    const event = req.body;

    const id = getId(req.headers.authorization);

    event.student.id = id;

    queries.createSuggestedEvent(event, result => {

        const title = "Student suggested Event on GO Program";
            
        const emailBody =   '<div>Dear Admin,</div><br/>'+
                            '<div>Student with id <b>'+id+'</b> suggested the Event on GO Program.</div><br/>'+
                            '<div>Please visit GO Program website for further action on the submitted order. </div><br/>'+
                            '<div>Thank You and Regards,</div>'+
                            '<div>The GO program</div>'+
                            '<div>Charles W. Davidson College of Engineering</div>'+
                            '<div>San José State University</div>';
                    
        sendMail(title, 
                emailBody,
                "coe-go-project-group@sjsu.edu", messageInfo => {
                    res.status(200).send({message:'Suggested event created successfully', event: result});
                }, err => {
                    res.status(500).json({message:`Failed to send an email. If still issue persists then contact GO Program admin. ${err}`});
                }
        );

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
    
    if(!util.isUserStudent(req.headers.authorization)){
        console.log("Access failure for Student Own Suggested Events GET Request");
        return res.status(403).send({ message: constants.ACCESS_FAILURE_MSG});
    }

    const id = getId(req.headers.authorization);

    queries.getStudentOwnSuggestedEvents(id,events => {
        res.status(200).json({success: true, events: events});
    }, (err,tag)=> {
        res.status(500).send({ message: `Something failed when getting ${tag} from the database. ${err.message}`});
    });
});

router.post('/addSuggestedEventComment',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Student Add Suggested Event Comment Post Request");

    if(!util.isUserStudentOrManagerOrAdmin(req.headers.authorization)){
        console.log("Access failure for Student Add Suggested Event Comment POST Request");
        return res.status(403).send({ message: constants.ACTION_FAILURE_MSG});
    }

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
    
    if(!util.isUserStudentOrManagerOrAdmin(req.headers.authorization)){
        console.log("Access failure for Student Requests All Suggested Events GET Request");
        return res.status(403).send({ message: constants.ACCESS_FAILURE_MSG});
    }

    queries.getStudentsAllSuggestedEvents(events => {
        res.status(200).json({success: true, events: events});
    }, err=> {
        res.status(500).send({ message: `Something failed when getting suggested events from the database. ${err.message}`});
    });
});

router.post('/updateSuggestedEventStatus', passport.authenticate("jwt", { session: false }), function(req,res){
    console.log("Inside Student Update Suggested Event Status Post Request");

    if(!util.isUserManagerOrAdmin(req.headers.authorization)){
        console.log("Access failure for Student Update Suggested Event Status POST Request");
        return res.status(403).send({ message: constants.ACTION_FAILURE_MSG});
    }

    console.log("Req Body : ",req.body);
    const event = req.body;

    const id = getId(req.headers.authorization);

    event.updatedBy = id;
    queries.updateStudentSuggestedEventStatus(event, result => {
        // send email here

        const title = "Student Suggested Event Update on GO Program";
            
        const emailBody =   '<div>Dear Student,</div><br/>'+
                            '<div>The Admin of SJSU GO Program updated your Suggested Event status to: <b>'+event.status+'</b></div><br/>'+
                            '<div>Please contact SJSU GO Program admin for any further queries.</div><br/>'+
                            '<div>Thank You and Regards,</div>'+
                            '<div>The GO program</div>'+
                            '<div>Charles W. Davidson College of Engineering</div>'+
                            '<div>San José State University</div>';
                                                          
        sendMail(title, 
                 emailBody,
                 result.student.user.email, messageInfo => {
                    res.status(200).send({message:'Student suggested event status updated successfully', event: result});
                }, err => {
                    res.status(500).json({message:`Failed to send an email. If still issue persists then contact GO Program admin. ${err}`});
                 }
        );

    }, message =>{
        res.status(500).send({ message });
    });
});

router.get('/dashboardSuggestedEvents',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Student Dashboard Suggested Events Get Request");
    
    if(!util.isUserStudent(req.headers.authorization)){
        console.log("Access failure for Student Dashboard Suggested Events GET Request");
        return res.status(403).send({ message: constants.ACCESS_FAILURE_MSG});
    }

    const id = getId(req.headers.authorization);

    queries.getStudentDashboardSuggestedEvents(id,events => {
        res.status(200).json({success: true, events: events});
    }, (err,tag)=> {
        res.status(500).send({ message: `Something failed when getting ${tag} from the database. ${err.message}`});
    });
});

router.get('/dashboardApprovedSuggestedEvents',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Student Dashboard Approved Suggested Events Get Request");
    
    if(!util.isUserStudent(req.headers.authorization)){
        console.log("Access failure for Student Dashboard Approved Suggested Events GET Request");
        return res.status(403).send({ message: constants.ACCESS_FAILURE_MSG});
    }

    const id = getId(req.headers.authorization);

    queries.getStudentDashboardApprovedSuggestedEvents(id,events => {
        res.status(200).json({success: true, events: events});
    }, (err,tag)=> {
        res.status(500).send({ message: `Something failed when getting ${tag} from the database. ${err.message}`});
    });
});

module.exports = router;
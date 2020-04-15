var express = require('express');
var router = express.Router();
const queries = require('../utils/queries');
var passport = require("passport");

// router.get('/itemss',passport.authenticate("jwt", { session: false }),function(req,res){
//     console.log("Inside Student Items Get Request");
    
//     queries.getItems(items => {
//         res.status(200).json({success: true, items: items});
//     }, err=> {S
//         res.status(500).send({ message: `Something failed when getting items from the collection. ${err.message}`});
//     });
// });





// router.get('/events',passport.authenticate("jwt", { session: false }),function(req,res){
//     console.log("Inside Admin Events Get Request");
    
//     queries.getEvents(events => {
//         console.log("Events====", events);
//         res.status(200).json({success: true, events: events});
//     }, err=> {
//         res.status(500).send({ message: `Something failed when getting events from the collection. ${err.message}`});
//     });
// });



router.get('/events',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside Student Events Get Request");
    
    queries.getStudentEvents(events => {
        console.log("Events====", events);
        res.status(200).json({success: true, events: events});
    }, err=> {
        res.status(500).send({ message: `Something failed when getting events from the database. ${err.message}`});
    });
});

router.post('/createEvent', passport.authenticate("jwt", { session: false }), function(req,res){
    console.log("Inside Student Create Event Post Request");
    console.log("Req Body : ",req.body);
    const event = req.body;

    queries.createStudentEvent(event, result => {
            console.log("Event created: " + result);
            res.status(200).send({message:'Event created successfully', event: result});
        }, (err, tag)=>{
            if(err.code === 11000){
                res.status(401).send({ message: "You have already submitted this event. Please contact admin." });
            }else{
                res.status(500).send({ message: `Something failed when adding ${tag} in the database. ${err.message}`});
        }
    });
});

module.exports = router;
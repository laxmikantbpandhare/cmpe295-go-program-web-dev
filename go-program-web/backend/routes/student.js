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
    console.log("Inside Student All Events Get Request");
    
    queries.getStudentsAllEvents(events => {
        res.status(200).json({success: true, events: events});
    }, err=> {
        res.status(500).send({ message: `Something failed when getting students events from the database. ${err.message}`});
    });
});

module.exports = router;
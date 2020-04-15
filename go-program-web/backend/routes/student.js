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




module.exports = router;
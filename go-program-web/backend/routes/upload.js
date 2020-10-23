var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var passport = require("passport");


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
  })

var uploadSingle = multer({ storage: storage }).single('image');

var uploadMultiple = multer({ storage: storage }).array('image');

router.post('/images', passport.authenticate("jwt", { session: false }),(req, res) => {
    console.log("Inside upload images post Request");

    uploadMultiple(req, res, function(err){
        if(err){
            res.status(500).json({message: `Image upload failed due to internal issue. ${err}`});
            return;
        }
        var imagesName = req.files.map(file => file.filename)
        res.status(200).json({imagesName: imagesName}); 
    });
});


module.exports = router;
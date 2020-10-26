var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var passport = require("passport");
var jwt = require("jsonwebtoken");
const {secret} = require('../config/config');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      let id;
      if(req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, secret);
        id = decoded.id;
      } else {
        id = req.body.id;
      }
      cb(null, id + '_' + Date.now() + path.extname(file.originalname)) //Appending extension
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

router.post('/sjsuIdImage',(req, res) => {
  console.log("Inside upload image post Request");

  uploadSingle(req, res, function(err){
      if(err){
          res.status(500).json({message: `Image upload failed due to internal issue. ${err}`});
          return;
      }
      res.status(200).json({imageName: req.file.filename}); 
  });
});


module.exports = router;
var express = require('express');
var router = express.Router();
var multer = require('multer');
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
var path = require('path');
var passport = require("passport");
var {AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_S3_BUCKET_NAME, AWS_S3_BUCKET_REGION} = require('../config/config');
var config = require('../config/config');


aws.config.update({
    secretAccessKey: AWS_SECRET_KEY,
    accessKeyId: AWS_ACCESS_KEY,
    region: AWS_S3_BUCKET_REGION
});

const s3 = new aws.S3();

var storage = multerS3({
    s3: s3,
    bucket: AWS_S3_BUCKET_NAME,
    metadata: function(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function(req, file, cb) {
      cb(null, "sjsu_go:" + Date.now() + path.extname(file.originalname));
    }
});

var uploadSingle = multer({ storage: storage }).single('image');

var uploadMultiple = multer({ storage: storage }).array('image');

router.post('/item-images', passport.authenticate("jwt", { session: false }),(req, res) => {
    console.log("Inside item images post Request");

    uploadMultiple(req, res, function(err){
        if(err){
            res.status(500).json({message: `Image upload failed due to internal issue. ${err}`});
            return;
        }
        var imagesUrl = req.files.map(file => file.location)
        res.status(200).json({imagesUrl: imagesUrl}); 
    });
});

module.exports = router;
var express = require('express');
var router = express.Router();
const queries = require('../utils/queries');
const encrypt = require('../utils/encrypt');
var jwt = require("jsonwebtoken");
const {secret} = require('../config/config');
const {frontendURL} = require('../config/config');
var passport = require("passport");
const getId = require('../utils/getSjsuId');
const {sendMail} = require('../utils/email');
const util = require('../utils/util');
const constants = require('../utils/constants');


router.post('/signup',function(req,res){
    console.log("Inside User signup Post Request");
    const user = req.body;

    
    encrypt.generateHash(user.password, hash => {
        queries.createStudent(user, hash, result => {

            const title = "GO Program Account Activation Link";
            const email = user.email;
            // added token
            const token = jwt.sign({email}, secret, {expiresIn: '20m'});

            const emailBody =   '<div>Dear Student,</div>'+
                                '<h2>Please click on Link below to verify your account.</h2>'+
                                '<a href="'+frontendURL+'/confirm-email/'+token+'"><H2>Click on this Link to Activate Your Account</H2></a>'+
                                '<div>Thank You and Regards,</div>'+
                                '<div>The GO program</div>'+
                                '<div>Charles W. Davidson College of Engineering</div>'+
                                '<div>San José State University</div>';

            sendMail(title, 
                     emailBody,
                     user.email, messageInfo => {
                        res.status(200).json({message:'User created Successfully.'});
                    }, err => {
                        res.status(500).json({message:`Failed to send an email with Account Activation instruction. Please re-send email from SignUp page. If still issue persists then contact GO Program admin.${err}`});
                    }
            );

        }, (err, tag) => {
            if(err.code === 11000){
                res.status(401).json({message: 'User with same SJSU Id/Email Id already exists.' });
            }else{
                res.status(500).json({message: `Something failed when inserting user in the ${tag} collection in the DB. ${err}`});
            }
        });
    }, err => {
        res.status(500).json({message: `Something failed when generating hash for the password to encrypt it. ${err}` });
    });
});

router.post('/resendEmail',function(req,res){
    console.log("Inside User Resend Email Verification Post Request");

    const email = req.body.email;

    var token = jwt.sign({email}, secret, {expiresIn: '20m'});

    queries.getUserByEmail(email, user => {
        if(user) {

            const title = "GO Program Account Activation Link";
            
            const emailBody =   '<div>Dear Student,</div>'+
                                '<h2>Please click on Link below to verify your account.</h2>'+
                                '<a href="'+frontendURL+'/confirm-email/'+token+'"><H2>Click on this Link to Activate Your Account</H2></a>'+
                                '<div>Thank You and Regards,</div>'+
                                '<div>The GO program</div>'+
                                '<div>Charles W. Davidson College of Engineering</div>'+
                                '<div>San José State University</div>';
                 
            sendMail(title, 
                     emailBody,
                     email, messageInfo => {
                        res.status(200).json({message:'Email sent successfully. Please check your inbox for the Account Activation Link.'});
                     }, err => {
                        res.status(500).json({message:`Failed to send an email with Account Activation instruction. Please re-send email from SignUp page. If still issue persists then contact GO Program admin.${err}`});
                     }
            );

        } else {
            res.status(401).json({success: false, message: "User with specified email does not exists. You need to sign up before using the system."});
        }
    }, err => {
        res.status(500).json({success: false, message: `Something wrong when getting the user from the database. ${err}`});
    });

});

router.post('/verifyEmail', function(req,res){
    console.log("Inside User Email Verification Post Request");

    const token = req.query.email;

    jwt.verify(token, secret, function(err, decodedToken){
        if(err){
            res.status(400).json({message:`Incorrect or Expired link. Please resend email verification link from SignUp Page.`});
        }else{

            queries.changeEmailVerified(decodedToken.email, result => {

                const title = "Student Account approval request on GO Program";
                    
                const emailBody =   '<div>Dear Admin,</div><br/>'+
                                    '<div>Student submitted the account activation request on GO Program. </div><br/>'+
                                    '<div>Please visit GO Program website for further action on the submitted request. </div><br/>'+
                                    '<div>Thank You and Regards,</div>'+
                                    '<div>The GO program</div>'+
                                    '<div>Charles W. Davidson College of Engineering</div>'+
                                    '<div>San José State University</div>';
                                               
                sendMail(title, 
                         emailBody,
                         "coe-go-project-group@sjsu.edu", messageInfo => {
                            res.status(200).json({message:`Account is Verified.\nThis is a Two step verification. Please wait for the Admin to verify and activate the account.`});
                        }, err => {
                            res.status(500).json({message:`Failed to send an email. If still issue persists then contact GO Program admin. ${err}`});
                        }
                );
        
            }, message =>{
                res.status(500).json({ message: `Unable to update status in the DB.${message}` });
            });
            
        }
    });

});

router.post('/createAdmin', passport.authenticate("jwt", { session: false }), function(req, res){
    console.log("Inside User Create Admin Post Request");

    if(!util.isUserManager(req.headers.authorization)){
        console.log("Access failure for  Create Admin POST Request");
        return res.status(403).send({ message: constants.ACTION_FAILURE_MSG});
    }

    const user = req.body;
    const randomPassword = Math.random().toString(36).slice(-8);

    encrypt.generateHash(randomPassword, hash => {
        queries.createAdmin(user, hash, result => {
            // We don't need to send password ever over the network,
            // so convert mongoose Object to JS Object and remove password
            const resultObject = { ...result.toObject() };
            const {password, ...admin} = resultObject;
            admin._id = admin._id.toString();

            const title = "GO Program Admin Account";
            
            const emailBody =   '<div>Dear Admin,</div><br/>'+
                                '<div>You have been added as a Admin on GO program. Please use your SJSU ID with the password: <b>'+randomPassword+'</b></div><br/>'+
                                '<div>Please contact SJSU GO Program authority for any further queries.</div><br/>'+
                                '<div>Thank You and Regards,</div>'+
                                '<div>The GO program</div>'+
                                '<div>Charles W. Davidson College of Engineering</div>'+
                                '<div>San José State University</div>';
         
            sendMail(title, 
                     emailBody,
                     user.email, messageInfo => {
                        res.status(200).json({message:'User created', admin});
                    }, err => {
                        res.status(500).json({message:`Failed to send an email that will inform Admin. If still issue persists then contact GO Program admin. ${err}`});
                     }
            );


        }, err => {
            if(err.code === 11000){
                res.status(401).json({message: 'User with same SJSU Id/Email Id already exists.' });
            }else{
                res.status(500).json({message: `Something failed when inserting user in the DB. ${err}`});
            }
        });
    }, err => {
        res.status(500).json({message: `Something failed when generating hash. ${err}` });
    });
})

router.post('/login',function(req,res){
    console.log("Inside User Login Post Request");
      
    const id = req.body.id;
    const password = req.body.password;

    queries.getUserPasswordById(id, row => {
        if(row){
            encrypt.confirmPassword(password,row.password, result => {
                if (result){
                    let user = {
                        email: row.email,
                        userType: row.userType,
                        id: id
                    }
                    var token = jwt.sign(user, secret, {
                        expiresIn: 100800 // in seconds
                    });
                    if(row.status === "Active" && row.emailVerified === "1"){
                        res.status(200).json({success: true, message: "Login successful", user: {userType: row.userType, fname: row.fname}, token: token});
                    } else if(row.emailVerified === "0"){
                        res.status(401).json({success: true, message: "Please verify your email address. If you missed it, then resend verification mail from SignUp Page."});
                    } else {
                        res.status(401).json({success: false, message: "The user is Inactive. Please wait for the Admin to verify your Identity. If you feel it is taking too long, please contact the administration."});
                    }
                }else{
                    res.status(401).json({success: false, message: "Incorrect Password"});
                }
            }, err => {
                res.status(500).json({success: false, message: `Something wrong with bcrypt. ${err}`});
            });
        }else{
            res.status(401).json({success: false, message: "User does not exists. Please try again"});
        }
    }, err => {
        res.status(500).json({success: false, message: `Something wrong when getting the user from the database. ${err}`});
    });
});

router.post('/changePassword', passport.authenticate("jwt", {session: false}), function(req,res){
    console.log("Inside User Change Password Post Request");

    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    const id = getId(req.headers.authorization);

    queries.getUserPasswordById(id, row => {
        encrypt.confirmPassword(oldPassword,row.password, result => {
            if (result){
                encrypt.generateHash(newPassword, hash => {
                    queries.changeUserPassword(id, hash, result => {
                        res.status(200).json({message:'Password Changed Successfully.'});
                    }, err => {
                        res.status(500).json({message: `Something failed when saving the new password. ${err}`});
                    });
                }, err => {
                    res.status(500).json({message: `Something failed when generating hash for the new password to encrypt it. ${err}` });
                });
            }else{
                res.status(401).json({success: false, message: "Incorrect Old Password"});
            }
        }, err => {
            res.status(500).json({success: false, message: `Something wrong with bcrypt with the old password. ${err}`});
        });
    }, err => {
        res.status(500).json({success: false, message: `Something wrong when getting the user from the database. ${err}`});
    });
});

router.post('/resetPassword',function(req,res){
    console.log("Inside User Reset Password Post Request");

    const email = req.body.email;

    queries.getUserByEmail(email, user => {
        if(user) {
            const randomPassword = Math.random().toString(36).slice(-8);
            encrypt.generateHash(randomPassword, hash => {
                queries.changeUserPassword(user.id, hash, result => {

                    const title = "Password Reset Instructions from GO Program";
            
                    const emailBody =   '<div>Dear User,</div><br/>'+
                                        '<div>Please use this password for log in to GO Program: <b>'+randomPassword+'</b> </div><br/>'+
                                        '<div>You can change your password by log in to the GO program. Please use change password for password change. </div><br/>'+
                                        '<div>Please contact SJSU admin for any further queries. </div><br/>'+
                                        '<div>Thank You and Regards,</div>'+
                                        '<div>The GO program</div>'+
                                        '<div>Charles W. Davidson College of Engineering</div>'+
                                        '<div>San José State University</div>';
                          
                    sendMail(title, 
                             emailBody,
                             email, messageInfo => {
                                res.status(200).json({message:'Password reset successfully. Please check your email for the new password.'});
                            }, err => {
                                res.status(500).json({message:`Failed to send an email. If still issue persists then contact GO Program admin. ${err}`});
                            }
                    );

                }, err => {
                    res.status(500).json({message: `Something failed when saving the new password. ${err}`});
                });

            }, err => {
                res.status(500).json({message: `Something failed when generating hash for the new password to encrypt it. ${err}` });
            });
        } else {
            res.status(401).json({success: false, message: "User with specified email does not exists. You need to sign up before using the system."});
        }
    }, err => {
        res.status(500).json({success: false, message: `Something wrong when getting the user from the database. ${err}`});
    });
});

router.get('/allStudents',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside User All Students Get Request");

    if(!util.isUserManagerOrAdmin(req.headers.authorization)){
        console.log("Access failure for User All Students GET Request");
        return res.status(403).send({ message: constants.ACCESS_FAILURE_MSG});
    }

    queries.getAllStudents(students => {
        res.status(200).json({students});
    }, err=> {
        res.status(500).json({ message: `Something failed when getting students from the database. ${err.message}`});
    });
});

router.get('/student',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside User Student Get Request");

    const id = getId(req.headers.authorization);
    
    queries.getStudent(id, student => {
        res.status(200).json({student});
    }, err=> {
        res.status(500).json({ message: `Something failed when getting student from the database. ${err.message}`});
    });
});

router.get('/allAdmins',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside User All Admins Get Request");
    
    if(!util.isUserManager(req.headers.authorization)){
        console.log("Access failure for All Admin GET Request");
        return res.status(403).send({ message: constants.ACCESS_FAILURE_MSG});
    }

    queries.getAllAdmins(admins => {
        res.status(200).json({admins});
    }, err=> {
        res.status(500).json({ message: `Something failed when getting admins from the database. ${err.message}`});
    });
});

router.post('/updateStatus', passport.authenticate("jwt", { session: false }), function(req,res){
    console.log("Inside User Update Status Post Request");

    if(!util.isUserManagerOrAdmin(req.headers.authorization)){
        console.log("Access failure for User Update Status POST Request");
        return res.status(403).send({ message: constants.ACTION_FAILURE_MSG});
    }

    const user = req.body;

    const id = getId(req.headers.authorization);

    user.updatedBy = id;

    queries.updateUserStatus(user, result => {
        // We don't need to send password ever over the network,
        // so convert mongoose Object to JS Object and remove password
        const resultObject = { ...result.toObject() };
        const {password, ...updatedUser} = resultObject;
        updatedUser._id = updatedUser._id.toString();
        
        // send email here
        queries.getUserEmailById(user.id, row => {
            if(row){

                const title = "Student Account Status Update on GO Program";
            
                const emailBody =   '<div>Dear Student,</div><br/>'+
                                    '<div>The GO Program Admin has changed your account status to: <b>'+user.status+'</b> </div><br/>'+
                                    '<div>Please contact SJSU admin for any further queries. </div><br/>'+
                                    '<div>Thank You and Regards,</div>'+
                                    '<div>The GO program</div>'+
                                    '<div>Charles W. Davidson College of Engineering</div>'+
                                    '<div>San José State University</div>';
                              
                sendMail(title, 
                         emailBody,
                         row.email, messageInfo => {
                            res.status(200).json({message:`User's status updated successfully`, user: updatedUser});
                        }, err => {
                            res.status(500).json({message:`Failed to send an email. If still issue persists then contact GO Program admin. ${err}`});
                        }
                );
            }else{
                res.status(401).json({success: false, message: "User does not exists. Please try again"});         
            }
        }, err => {
            res.status(500).json({success: false, message: `Something wrong when getting the user from the database. ${err}`});
        });
    }, message =>{
        res.status(500).json({ message });
    });
});

router.post('/updateAdmin', passport.authenticate("jwt", { session: false }), function(req,res){
    console.log("Inside User Update Admin Post Request");
    const user = req.body;


    if(!util.isUserManager(req.headers.authorization)){
        console.log("Access failure for Update Admin POST Request");
        return res.status(403).send({ message: constants.ACTION_FAILURE_MSG});
    }

    queries.updateAdmin(user, result => {
        // We don't need to send password ever over the network,
        // so convert mongoose Object to JS Object and remove password
        const resultObject = { ...result.toObject() };
        const {password, ...updatedUser} = resultObject;
        updatedUser._id = updatedUser._id.toString();
        res.status(200).json({message:`Admin user updated successfully`, admin: updatedUser});
    }, message => {
        res.status(500).json({ message: `Something wrong when reading the record from the database. ${message}` });
    });
});

router.post('/updateStudent', passport.authenticate("jwt", { session: false }), function(req,res){
    console.log("Inside User Update Student Post Request");

    if(!util.isUserStudent(req.headers.authorization)){
        console.log("Access failure for User Update Student POST Request");
        return res.status(403).send({ message: constants.ACTION_FAILURE_MSG});
    }

    const student = req.body;

    const id = getId(req.headers.authorization);
    queries.updateStudent(id, student, result => {
        res.status(200).json({message:`Student updated successfully`, student: result});
    }, message => {
        res.status(500).json({ message: `Something wrong when updating the record in the database. ${message}` });
    });
});

module.exports = router;
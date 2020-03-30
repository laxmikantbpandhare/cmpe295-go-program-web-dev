'use strict';
var bcrypt = require('bcrypt');

const encrypt = {};

encrypt.generateHash = (password, successcb, failurecb) => {
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function(err, salt) {
        if(err){
            failurecb(err);
            return;
        }
        bcrypt.hash(password, salt, function(err, hash) {
            if(err){
                failurecb(err);
                return;
            }
            successcb(hash);
        });
    });
}

encrypt.confirmPassword = (password, hash, successcb, failurecb) => {
    bcrypt.compare(password, hash, function(err, result) {
        if(err){
            failurecb(err);
            return;
        }
        successcb(result);
    });
}

module.exports = encrypt;
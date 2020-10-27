const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    id : {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    userType : {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        required: true,
        default: ()=> new Date()
    },
    updatedBy: {
        type: String,
    },
    updatedDate: {
        type: Date
    },
});

userSchema.pre('save', function(next){
    this.updatedDate = new Date();
    next();
});

module.exports = mongoose.model('Users', userSchema);
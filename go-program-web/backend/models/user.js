const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    id : {
        type: String,
        required: true,
        unique: true
    },
    major : {
        type: String,
        required: true
    },
    year : {
        type: String,
        required: true
    },
    userType : {
        type: String
    }
});

module.exports = mongoose.model('Users', userSchema);
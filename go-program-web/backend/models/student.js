const mongoose = require('mongoose')

const studentSchema = mongoose.Schema({
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
    sjsuId : {
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
    pointsAccumulated: {
        type: Number,
        default: 0
    },
    pointsSpent: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Students', studentSchema);
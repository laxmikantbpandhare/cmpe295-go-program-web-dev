const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
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
    },
    studentIdCard: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        required: true,
        default: ()=> new Date()
    }
});

module.exports = mongoose.model('Students', studentSchema);
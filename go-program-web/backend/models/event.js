const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    points: {
        type: String,
        required: true
    },
    expiry_date: {
        type: String
    },
    created_by : {
        type: String,
        required: true
    },
    created_date : {
        type: String,
        required: true
    },
    updated_date : {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Events', eventSchema);
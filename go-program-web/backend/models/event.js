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
    expiryDate: {
        type: Date,
        default: null
    },
    createdBy : {
        type: String,
        required: true
    },
    createdDate : {
        type: String,
        required: true,
        default: ()=> new Date()
    },
    updatedBy : {
        type: String
    },
    updatedDate : {
        type: String
    }
});

eventSchema.pre('save', function(next){
    if(this.updatedBy){
        this.updatedDate = new Date();
    }
    next();
});

module.exports = mongoose.model('Events', eventSchema);
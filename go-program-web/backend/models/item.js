const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    points: {
        type: String,
        required: true
    },
    attributes : [
        {
            size: {
                type: String,
                required: true
            },
            quantity: {
                type: String,
                require: true
            }
        }
    ],
    images : [
        {
            type: String,
            required: true
        }
    ],
    createdBy : {
        type: String,
        required: true
    },
    createdDate : {
        type: Date,
        required: true,
        default: ()=> new Date()
    },
    updatedBy : {
        type: String
    },
    updatedDate : {
        type: Date
    }
});

itemSchema.pre('save', function(next){
    if(this.updatedBy){
        this.updatedDate = new Date();
    }
    next();
});

module.exports = mongoose.model('Items', itemSchema);
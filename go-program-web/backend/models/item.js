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

module.exports = mongoose.model('Items', itemSchema);
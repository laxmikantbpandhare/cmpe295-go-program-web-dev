const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Students',
        required: true
    },
    items: [
        {
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Items',
                required: true
            },
            size: {
                type: String,
                required: true
            },
            quantity: {
                type: String,
                required: true
            }
        }
    ],
    points: {
        type: Number,
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
    comments: [
        {   
            commenter: {
                type: String,
                required: true
            },
            comment: {
                type: String,
                required: true
            },
            commentDate: {
                type: String,
                required: true
            }
        }
    ]
});

orderSchema.pre('save', function(next){
    this.updatedDate = new Date();
    next();
});

module.exports = mongoose.model('Orders', orderSchema);
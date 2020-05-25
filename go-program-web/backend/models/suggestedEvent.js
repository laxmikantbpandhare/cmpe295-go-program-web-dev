const mongoose = require('mongoose');

const suggestedEventSchema = mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Students',
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
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

suggestedEventSchema.pre('save', function(next){
    this.updatedDate = new Date();
    next();
});

module.exports = mongoose.model('SuggestedEvents', suggestedEventSchema);
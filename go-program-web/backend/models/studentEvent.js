const mongoose = require('mongoose');

const studentEventSchema = mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Events',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Students',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    completedDate: {
        type: Date,
        required: true
    },
    images : [
        {
            type: String,
            required: true
        }
    ],
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

studentEventSchema.index({ event: 1, student: 1 }, { unique: true });

studentEventSchema.pre('save', function(next){
    this.updatedDate = new Date();
    next();
});

module.exports = mongoose.model('StudentEvents', studentEventSchema);
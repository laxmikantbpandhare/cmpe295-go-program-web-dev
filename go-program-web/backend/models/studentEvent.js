const mongoose = require('mongoose');

const studentEventSchema = mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    completedDate: {
        type: String,
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
        type: String,
        required: true
    },
    updatedDate: {
        type: String,
        required: true
    },
});

studentEventSchema.index({ event: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('StudentEvents', studentEventSchema);
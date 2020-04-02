const mongoose = require('mongoose')

var CounterSchema = mongoose.Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
});
module.exports = mongoose.model('Counters', CounterSchema);
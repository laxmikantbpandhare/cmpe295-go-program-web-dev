const User = require('../models/user');

var queries = {};

queries.createUser = (user, hash, successcb, failurecb) => {
    console.log("Creating user");
    const doc = new User({
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        id: user.id,
        major: user.major,
        year: user.year,
        password: hash,
        userType: "student"
    });
    doc.save()
    .then(result => successcb(result))
    .catch(err => failurecb(err))
}

// queries.authenticateUser = (id, email, successcb, failurecb) => {
//     User.findOne({id, email})
//     .then(user => successcb(user))
//     .catch(err => failurecb(err))
// }

queries.getUserPasswordById = (id, successcb, failurecb) => {
    User.findOne({id})
    .select('password fname email userType')
    .then(result => successcb(result))
    .catch(err => failurecb(err))
}

module.exports = queries;
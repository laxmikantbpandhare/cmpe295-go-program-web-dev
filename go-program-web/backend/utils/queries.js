const User = require('../models/user');
const Item = require('../models/item');
const Event = require('../models/event');

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

queries.getUserPasswordById = (id, successcb, failurecb) => {
    User.findOne({id})
    .select('password fname email userType')
    .then(result => successcb(result))
    .catch(err => failurecb(err))
}

queries.getItems = (successcb, failurecb) => {
    Item.find().sort({ updated_date: -1 })
    .then(items => {
        successcb(items)})
    .catch(err => failurecb(err))
}

queries.createItem = (item, successcb, failurecb) => {
    const doc = new Item({
        name: item.name,
        description: item.description,
        category: item.category,
        points: item.points,
        attributes: item.attributes,
        images: item.images,
        created_by: item.created_by,
        created_date: item.created_date,
        updated_date: item.updated_date
    });
    doc.save()
    .then(result => {
        successcb(result)})
    .catch(err => {
        failurecb(err)})
}

queries.updateItem = (item, successcb, failurecb) => {
    Item.findOne({_id:item._id})
    .then(itemToUpdate => {
        itemToUpdate["name"] = item.name;
        itemToUpdate["description"] = item.description;
        itemToUpdate["points"] = item.points;
        itemToUpdate["category"] = item.category;
        itemToUpdate["attributes"] = item.attributes;
        itemToUpdate["updated_date"] = item.updated_date;
        itemToUpdate.save()
        .then(item => {
            successcb(item);
        })
        .catch(err => failurecb(err))
    })
    .catch(err => failurecb(err))
}

queries.deleteItem = (id, successcb, failurecb) => {
    Item.findOneAndRemove({_id:id})
    .then(result => {
        successcb(result);
    })
    .catch(err => failurecb(err))
}

queries.getEvents = (successcb, failurecb) => {
    Event.find().sort({ updated_date: -1 })
    .then(events => {
        successcb(events)})
    .catch(err => failurecb(err))
}

queries.createEvent = (event, successcb, failurecb) => {
    const doc = new Event({
        name: event.name,
        description: event.description,
        points: event.points,
        expiry_date: event.expiry_date,
        created_by: event.created_by,
        created_date: event.created_date,
        updated_date: event.updated_date
    });
    doc.save()
    .then(result => {
        successcb(result)})
    .catch(err => {
        failurecb(err)})
}

queries.updateEvent = (event, successcb, failurecb) => {
    Event.findOne({_id:event._id})
    .then(eventToUpdate => {
        eventToUpdate["name"] = event.name;
        eventToUpdate["description"] = event.description;
        eventToUpdate["points"] = event.points;
        eventToUpdate["expiry_date"] = event.expiry_date;
        eventToUpdate["updated_date"] = event.updated_date;
        eventToUpdate.save()
        .then(event => {
            successcb(event);
        })
        .catch(err => failurecb(err))
    })
    .catch(err => failurecb(err))
}

queries.deleteEvent = (id, successcb, failurecb) => {
    Event.findOneAndRemove({_id:id})
    .then(result => {
        successcb(result);
    })
    .catch(err => failurecb(err))
}

module.exports = queries;
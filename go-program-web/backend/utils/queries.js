const User = require('../models/user');
const Item = require('../models/item');
const Event = require('../models/event');
const Student = require('../models/student');
const StudentEvent = require('../models/studentEvent');

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
    .then(user => successcb(user))
    .catch(err => failurecb(err))
}

queries.getItems = (successcb, failurecb) => {
    Item.find().sort({ updatedDate: -1 })
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
        createdBy: item.createdBy
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
        itemToUpdate["updatedBy"] = item.updatedBy;
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
    Event.find().sort({ updatedDate: -1 })
    .then(events => {
        successcb(events)})
    .catch(err => failurecb(err))
}

queries.getActiveEvents = (successcb, failurecb) => {
    var today = new Date().toLocaleDateString();
    console.log("today----",today);
    Event.find({$or: [
        {expiryDate: ""}, 
        {expiryDate: {$gte: today}}
      ]}).sort({ updatedDate: -1 })
    .then(events => {
        successcb(events)})
    .catch(err => failurecb(err))
}

queries.createEvent = (event, successcb, failurecb) => {
    const doc = new Event({
        name: event.name,
        description: event.description,
        points: event.points,
        expiryDate: event.expiryDate,
        createdBy: event.createdBy
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
        eventToUpdate["expiryDate"] = event.expiryDate;
        eventToUpdate["updatedBy"] = event.updatedBy;
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

queries.getStudentEvents = (successcb, failurecb) => {
    StudentEvent.find().sort({ updatedDate: -1 })
    .then(events => {
        successcb(events)})
    .catch(err => failurecb(err))
}

queries.createStudentEvent = (event, successcb, failurecb) => {
    Student.findOne({sjsuId: event.studentId})
    .select('_id')
    .then(student => {
        if(student === null){
            const doc = new Student({
                sjsuId:sjsuid 
            })
        }
    })
    .catch(err => failurecb(err))

    const doc = new Event({
        event: event.eventId,
        student: event.studentId,
        description: event.description,
        completedDate: event.completedDate,
        images: event.images,
        status: "Pending Approval",
        createdBy: event.createdBy,
        createdDate: event.createdDate,
        updatedDate: event.updatedDate
    });
    doc.save()
    .then(result => {
        successcb(result)})
    .catch(err => {
        failurecb(err)})
}

module.exports = queries;
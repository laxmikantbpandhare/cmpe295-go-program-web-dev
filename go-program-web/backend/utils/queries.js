const User = require('../models/user');
const Item = require('../models/item');

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
        console.log("items----", items);
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

module.exports = queries;
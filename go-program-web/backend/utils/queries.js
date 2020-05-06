const User = require('../models/user');
const Item = require('../models/item');
const Event = require('../models/event');
const Student = require('../models/student');
const StudentEvent = require('../models/studentEvent');
const Order = require('../models/order');
const Counter = require('../models/counter');
const mongoose = require('mongoose');

var queries = {};

queries.createUser = (user, hash, successcb, failurecb) => {
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
    var today = new Date(new Date().toLocaleDateString());
    
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
        successcb(result)
    })
    .catch(err => {
        failurecb(err)
    })
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

queries.getStudentOwnEvents = (id, successcb, failurecb) => {
    Student.findOne({sjsuId: id})
    .select('_id')
    .then(student => {
        // if(student !== null){

        // }
        StudentEvent.find({student: student._id})
        .populate('student')
        .populate('event')
        .sort({updatedDate:-1})
        .exec()
        .then(events => {
            successcb(events)})
        .catch(err => failurecb(err,"Student Events"))
    })
    .catch(err => {
        
        failurecb(err,"Student")
    })
}

queries.createStudentEvent = (event, successcb, failurecb) => {
    Student.findOne({sjsuId: event.student.id})
    .select('_id')
    .then(student => {
        if(student === null){
            const doc = new Student({
                sjsuId:event.student.id,
                fname: event.student.fname,
                lname: event.student.lname,
                email: event.student.email,
                major: event.student.major,
                year: event.student.year
            });
            doc.save()
            .then(result => {
                const eventDoc = new StudentEvent({
                    event:event.event.id,
                    student: result._id,
                    description: event.description,
                    completedDate: event.completedDate,
                    images: event.images,
                    status: "Pending Approval"
                });
                eventDoc.save()
                .then(studentEvent => {
                    studentEvent.populate('event').populate('student').execPopulate()
                    .then(studentEvent=> {successcb(studentEvent);})
                })
                .catch(err => {
                    failurecb(err, "StudentEvent");
                })
            })
            .catch(err => {
                failurecb(err, "Student");
            })
        } else {
            const eventDoc = new StudentEvent({
                event: event.event.id,
                student: student._id,
                description: event.description,
                completedDate: event.completedDate,
                images: event.images,
                status: "Pending Approval"
            });
            eventDoc.save()
            .then(studentEvent => {
                studentEvent.
                populate('event').
                populate('student').
                execPopulate().
                then(studentEvent => {successcb(studentEvent)})
            })
            .catch(err => {
                failurecb(err, "StudentEvent");
            })
        }
    })
    .catch(err => failurecb(err,"Student"))
}

queries.getStudentsAllEvents = (successcb, failurecb) => {
    StudentEvent.find()
    .populate('student')
    .populate('event')
    .sort({updatedDate:-1})
    .exec()
    .then(events => {
        successcb(events)})
    .catch(err => failurecb(err))
}

queries.updateStudentEventStatus = (event, successcb, failurecb) => {
    StudentEvent.findById(event.id)
    .then(eventToUpdate => {
        eventToUpdate["status"] = event.status;
        eventToUpdate["updatedBy"] = `Admin(${event.updatedBy})`;
        eventToUpdate.save()
        .then(updatedEvent => {
            if(event.status === "Approved"){
                Student.findById(event.student.id)
                .then(StudentToUpdate => {
                    const newPoints = StudentToUpdate["pointsAccumulated"] + Number(event.event.points);
                    StudentToUpdate["pointsAccumulated"] = newPoints;
                    StudentToUpdate.save()
                    .then(updatedStudent => {
                        updatedEvent.
                        populate('event').
                        populate('student').
                        execPopulate().
                        then(populatedEvent => {
                            successcb(populatedEvent)
                        })
                    })
                    .catch(err => {
                        let message = `Unable to update Student points in the db. ${err.message}`;
                        failurecb(message);
                    })
                })
                .catch(err => {
                    let message = `Unable to get Student details from the db. ${err.message}`;
                    failurecb(message);
                })
            } else {
                updatedEvent.
                populate('event').
                populate('student').
                execPopulate().
                then(updatedEvent => {
                    successcb(updatedEvent)
                })
            }
        })
        .catch(err => {
            let message = `Unable to update StudentEvent in the db. ${err.message}`;
            failurecb(message);
        })
    })
    .catch(err => {
        let message = `Failed to get StudentEvent details from the db. ${err.message}`;
        failurecb(message);
    })
}

queries.updateStudentEvent = (event, successcb, failurecb) => {
    StudentEvent.findById(event.id)
    .then(eventToUpdate => {
        eventToUpdate["description"] = event.description;
        eventToUpdate["updatedBy"] = `Student(${event.updatedBy})`;
        const newImages = [...event.images, ...eventToUpdate["images"]];
        eventToUpdate["images"] = newImages;
        eventToUpdate["status"] = "Pending Approval";
        eventToUpdate.save()
        .then(updatedEvent => {
            updatedEvent
            .populate('event')
            .populate('student')
            .execPopulate()
            .then(populatedEvent => {
                successcb(populatedEvent)
            })
        })
        .catch(err => {
            let message = `Unable to update StudentEvent in the db. ${err.message}`;
            failurecb(message);
        })
    })
    .catch(err => {
        let message = `Failed to get StudentEvent details from the db. ${err.message}`;
        failurecb(message);
    })
}

queries.getStudentPoints = (id, successcb, failurecb) => {
    Student.findOne({sjsuId: id})
    .select('pointsAccumulated')
    .then(student => {
        let points = 0;
        if(student !== null){
            points = student.pointsAccumulated;
        }
        successcb(points);
    })
    .catch(err => failurecb(err))
}

queries.addStudentEventComment = (eventId, comment, successcb, failurecb) => {
    StudentEvent.findById(eventId)
    .then(event => {
        event.comments.push(comment);
        event.save()
        .then(updatedEvent => {
            updatedEvent
            .populate('event')
            .populate('student')
            .execPopulate()
            .then(populatedEvent => {
                successcb(populatedEvent)
            })
        })
        .catch(err => failurecb(err))
    })
    .catch(err => failurecb(err))
}

queries.getItem = (itemId,successcb, failurecb) => {
    Item.findById(itemId)
    .then(item => successcb(item))
    .catch(err => failurecb(err))
}

queries.createOrder = (order, successcb, failurecb) => {
    Student.findOne({sjsuId: order.student.id})
    .select('_id pointsAccumulated')
    .then(student => {
        const newPoints = student["pointsAccumulated"] - Number(order.points);
        student["pointsAccumulated"] = newPoints;
        student.save()
        .then(updatedStudent => {
            Counter.findByIdAndUpdate( "orderId" , { $inc: { seq: 1 }}, {new: true, upsert: true }).
            select('seq')
            .then(counter => {
                const newOrder = new Order({
                    id: counter.seq,
                    student: student._id,
                    items: order.orderItems,
                    points: order.points,
                    status: "Submitted"
                });
                newOrder.save()
                .then(savedOrder => {
                    Item.bulkWrite(
                        order.inventoryItems.map(item => ({
                            updateOne: {
                                filter: {_id: item.itemId},
                                update: {$set: { "attributes.$[attribute].quantity": item.newQuantity} },
                                arrayFilters: [
                                    {
                                        "attribute._id": mongoose.Types.ObjectId(item.attributeId)
                                    }
                                ]
                            }
                        })
                        )
                    )
                    .then(result => {
                        successcb(savedOrder)
                    })
                    .catch(err => {
                        let message = `Failed to update quantity of items in the db. ${err.message}`;
                        failurecb(message);
                    })
                })
                .catch(err => {
                    let message = `Failed to add Order details in the db. ${err.message}`;
                    failurecb(message);
                })
            })
            .catch(err => {
                let message = `Unable to generate new order id in the db. ${err.message}`;
                failurecb(message);
            })
        })
        .catch(err => {
            let message = `Unable to update Student points in the db. ${err.message}`;
            failurecb(message);
        })
    })
    .catch(err => {
        let message = `Failed to get Student details from the db. ${err.message}`;
        failurecb(message);
    })
}

queries.getStudentOwnOrders = (id, successcb, failurecb) => {
    Student.findOne({sjsuId: id})
    .select('_id')
    .then(student => {
        // if(student !== null){

        // }
        Order.find({student: student._id})
        .populate('student')
        .populate('items.item')
        .sort({updatedDate:-1})
        .exec()
        .then(events => {
            successcb(events)})
        .catch(err => failurecb(err,"Student Orders"))
    })
    .catch(err => {
        failurecb(err,"Student")
    })
}

queries.addStudentOrderComment = (orderId, comment, successcb, failurecb) => {
    Order.findById(orderId)
    .then(order => {
        order.comments.push(comment);
        order.save()
        .then(updatedOrder => {
            updatedOrder
            .populate('student')
            .populate('items.item')
            .execPopulate()
            .then(populatedOrder => {
                successcb(populatedOrder)
            })
        })
        .catch(err => failurecb(err))
    })
    .catch(err => failurecb(err))
}

queries.getStudentsAllOrders = (successcb, failurecb) => {
    Order.find()
    .populate('student')
    .populate('items.item')
    .sort({updatedDate:-1})
    .exec()
    .then(orders => {
        successcb(orders)})
    .catch(err => failurecb(err))
}

module.exports = queries;
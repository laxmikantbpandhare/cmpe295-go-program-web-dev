const User = require('../models/user');
const Item = require('../models/item');
const Event = require('../models/event');
const Student = require('../models/student');
const StudentEvent = require('../models/studentEvent');
const SuggestedEvent = require('../models/suggestedEvent');
const Order = require('../models/order');
const Counter = require('../models/counter');
const mongoose = require('mongoose');

var queries = {};

queries.createStudent = (user, hash, successcb, failurecb) => {
    const Userdoc = new User({
        id: user.id,
        password: hash,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        userType: "student",
        status: "Inactive",
        emailVerified: "0"
    });
    Userdoc.save()
    .then(result => {
        const studentDoc = new Student({
            user: result._id,
            sjsuId: user.id,
            major: user.major,
            year: user.year,
            studentIdCard: user.imageName
        });
        studentDoc.save()
        .then(student => {
            successcb(student);
        })
        .catch(err => failurecb(err, "Student"))
    })
    .catch(err => failurecb(err, "User"))
}

queries.createAdmin = (user, hash, successcb, failurecb) => {
    const Userdoc = new User({
        id: user.id,
        password: hash,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        emailVerified: "1",
        userType: "admin",
        status: "Active"
    });
    Userdoc.save()
    .then(admin => {
        successcb(admin);
    })
    .catch(err => {
        failurecb(err);
    })
}

queries.updateAdmin = (user, successcb, failurecb) => {
    User.findOne({_id:user._id})
    .then(adminToUpdate => {
        adminToUpdate["id"] = user.id;
        adminToUpdate["fname"] = user.fname;
        adminToUpdate["lname"] = user.lname;
        adminToUpdate["email"] = user.email;
        adminToUpdate["status"] = user.status;
        adminToUpdate.save()
        .then(admin => {
            successcb(admin);
        })
        .catch(err => {
            failurecb(err);
        })
    })
    .catch(err => failurecb(err))
}

queries.updateStudent = (id, student, successcb, failurecb) => {
    Student.findOne({sjsuId: id})
    .then(studentToUpdate => {
        studentToUpdate["major"] = student.major;
        studentToUpdate["year"] = student.year;
        studentToUpdate.save()
        .then(updatedStudent => {
            updatedStudent
            .populate({
                path : 'user',
                select: 'fname lname email'
            })
            .execPopulate().
            then(student => {
                successcb(student);
            })
        })
        .catch(err => {
            failurecb(err);
        })
    })
    .catch(err => failurecb(err))
}

queries.updateStudentPoints = (student, successcb, failurecb) => {
    Student.findOne({sjsuId: student.id})
    .then(studentToUpdate => {
        studentToUpdate["pointsAccumulated"] += (student.newPoints - student.previousPoints);
        studentToUpdate.save()
        .then(updatedStudent => {
            updatedStudent
            .populate({
                path : 'user',
                select: 'fname lname email id status createdDate updatedBy updatedDate'
            })
            .execPopulate().
            then(student => {
                successcb(student);
            })
        })
        .catch(err => {
            failurecb(err);
        })
    })
    .catch(err => failurecb(err))
}

queries.getUserPasswordById = (id, successcb, failurecb) => {
    User.findOne({id})
    .then(user => successcb(user))
    .catch(err => failurecb(err))
}

queries.getUserEmailById = (id, successcb, failurecb) => {
    User.findOne({id:id})
    .then(user => successcb(user))
    .catch(err => failurecb(err))
}

queries.getUserByEmail = (email, successcb, failurecb) => {
    User.findOne({email})
    .then(user => successcb(user))
    .catch(err => failurecb(err))
}

queries.changeUserPassword = (id, hash, successcb, failurecb) => {
    User.findOne({ id })
    .then(userToUpdate => {
        userToUpdate["password"] = hash;
        userToUpdate.save()
        .then(user => {
            successcb(user);
        })
        .catch(err => failurecb(err))
    })
    .catch(err => {
        failurecb(err);
    })
}

queries.changeEmailVerified = (email, successcb, failurecb) => {
    User.findOne({ email })
    .then(userToUpdate => {
        userToUpdate["emailVerified"] = "1";
        userToUpdate.save()
        .then(user => {
            successcb(user);
        })
        .catch(err => failurecb(err))
    })
    .catch(err => {
        failurecb(err);
    })
}

queries.getAllStudents = (successcb, failurecb) => {
    Student.find()
    .populate({
        path: 'user',
        match: { emailVerified: "1"},
        select: 'fname lname email id status createdDate updatedBy updatedDate'
    })
    .sort({ createdDate: -1 })
    .exec()
    .then(students => {
        var emailVerifiedStudent = students.filter(student => student.user)
        successcb(emailVerifiedStudent);
    })
    .catch(err => {
        failurecb(err);
    })
}

queries.getStudent = (id, successcb, failurecb) => {
    Student.findOne({sjsuId: id})
    .populate({
        path: 'user',
        select: 'fname lname email'
    })
    .exec()
    .then(student => {
        successcb(student);
    })
    .catch(err => {
        failurecb(err);
    })
}

queries.updateUserStatus = (user, successcb, failurecb) => {
    User.findOne({id: user.id})
    .then(userToUpdate => {
        userToUpdate["status"] = user.status;
        userToUpdate["updatedBy"] = `${user.updatedBy}`
        userToUpdate.save()
        .then(user => {
            successcb(user);
        })
        .catch(err => failurecb(err))
    })
    .catch(err => {
        failurecb(err);
    })
}

queries.getAllAdmins = (successcb, failurecb) => {
    User.find({userType: 'admin'}).sort({ updatedDate: -1 })
    .select('-password')
    .then(admins => {
        successcb(admins);
    })
    .catch(err => {
        failurecb(err);
    })
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

queries.getStudentOwnEvents = (id, successcb, failurecb) => {
    Student.findOne({sjsuId: id})
    .select('_id')
    .then(student => {
        if(student !== null){
            StudentEvent.find({student: student._id})
            .populate('event')
            .sort({updatedDate:-1})
            .exec()
            .then(events => {
                successcb(events);
            })
            .catch(err => failurecb(err,"Student Events"))
        } else {
            successcb([]);
        }
    })
    .catch(err => {
        failurecb(err,"Student")
    })
}

queries.createStudentEvent = (event, successcb, failurecb) => {
    Student.findOne({sjsuId: event.student.id})
    .select('_id')
    .then(student => {
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
            execPopulate().
            then(studentEvent => {successcb(studentEvent)})
        })
        .catch(err => {
            failurecb(err, "Student Event");
        })
    })
    .catch(err => failurecb(err,"Student"))
}

queries.getStudentsAllEvents = (successcb, failurecb) => {
    StudentEvent.find()
    .populate({
        path : 'student',
        select: 'sjsuId user major year',
        populate : {
          path: 'user',
          select: 'fname lname email'
        }
    })
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
                .then(studentToUpdate => {
                    const newPoints = studentToUpdate["pointsAccumulated"] + Number(event.event.points);
                    studentToUpdate["pointsAccumulated"] = newPoints;
                    studentToUpdate.save()
                    .then(updatedStudent => {
                        updatedEvent.
                        populate('event')
                        .populate({
                            path : 'student',
                            select: 'sjsuId user major year',
                            populate : {
                              path: 'user',
                              select: 'fname lname email'
                            }
                        })
                        .execPopulate()
                        .then(populatedEvent => {
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
                populate({
                    path : 'student',
                    select: 'sjsuId user major year',
                    populate : {
                      path: 'user',
                      select: 'fname lname email'
                    }
                }).
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
            .populate({
                path : 'student',
                select: 'sjsuId user major year',
                populate : {
                  path: 'user',
                  select: 'fname lname email'
                }
            })
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
    .select('pointsAccumulated pointsSpent')
    .then(student => {
        let pointsAccumulated = 0;
        let pointsSpent = 0;
        if(student !== null){
            pointsAccumulated = student.pointsAccumulated;
            pointsSpent = student.pointsSpent;
        }
        successcb(pointsAccumulated, pointsSpent);
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
            .populate({
                path : 'student',
                select: 'sjsuId user major year',
                populate : {
                  path: 'user',
                  select: 'fname lname email'
                }
            })
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
    .select('_id pointsSpent')
    .then(student => {
        const newPoints = student["pointsSpent"] + Number(order.points);
        student["pointsSpent"] = newPoints;
        student.save()
        .then(updatedStudent => {
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
                Counter.findByIdAndUpdate( "orderId" , { $inc: { seq: 1 }}, {new: true, upsert: true })
                .select('seq')
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
                        successcb(savedOrder)
                    })
                    .catch(err => {
                        let message = `Failed to add Order in the db. ${err.message}`;
                        failurecb(message);
                    })
                })
                .catch(err => {
                    let message = `Unable to generate new order id in the db. ${err.message}`;
                    failurecb(message);
                })
            })
            .catch(err => {
                let message = `Failed to update quantity of items in the db. ${err.message}`;
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
        if(student !== null){
            Order.find({student: student._id})
            .sort({updatedDate:-1})
            .then(orders => {
                successcb(orders)})
            .catch(err => failurecb(err,"Student Orders"))
        } else {
            successcb([])
        }
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
            .populate({
                path : 'student',
                select: 'sjsuId user',
                populate : {
                  path: 'user',
                  select: 'fname lname'
                }
            })
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
    .populate({
        path : 'student',
        select: 'sjsuId user',
        populate : {
          path: 'user',
          select: 'fname lname'
        }
    })
    .populate('items.item')
    .sort({updatedDate:-1})
    .exec()
    .then(orders => {
        successcb(orders)})
    .catch(err => failurecb(err))
}

queries.updateStudentOrderStatus = (order, successcb, failurecb) => {
    if(order.status === "Cancelled"){
        Student.findById(order.student.id)
        .then(studentToUpdate => {
            studentToUpdate["pointsSpent"] = studentToUpdate["pointsSpent"] - Number(order.points);
            studentToUpdate.save()
            .then(updatedStudent => {
                Item.bulkWrite(
                    order.items.map(item => ({
                        updateOne: {
                            filter: {_id: item.item},
                            update: {$inc: { "attributes.$[attribute].quantity": item.quantity } },
                            arrayFilters: [
                                {
                                    "attribute.size": item.size
                                }
                            ]
                        }
                    })
                    )
                )
                .then(result => {
                    Order.findById(order.id)
                    .then(orderToUpdate => {
                        orderToUpdate["status"] = order.status;
                        orderToUpdate["updatedBy"] = `Admin(${order.updatedBy})`;
                        orderToUpdate.save()
                        .then(updatedOrder => {
                            updatedOrder.
                            populate({
                                path : 'student',
                                select: 'sjsuId user',
                                populate : {
                                  path: 'user',
                                  select: 'fname lname email'
                                }
                            }).
                            populate('items.item').
                            execPopulate().
                            then(populatedOrder => {
                                successcb(populatedOrder)
                            })
                        })
                        .catch(err => {
                            let message = `Failed to get Order details from the db. ${err.message}`;
                            failurecb(message);
                        })
                    })
                    .catch(err => {
                        let message = `Unable to update Order in the db. ${err.message}`;
                        failurecb(message);
                    })
                })
                .catch(err => {
                    let message = `Failed to update quantity of items in the db. ${err.message}`;
                    failurecb(message);
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
        Order.findById(order.id)
        .then(orderToUpdate => {
            orderToUpdate["status"] = order.status;
            orderToUpdate["updatedBy"] = `Admin(${order.updatedBy})`;
            orderToUpdate.save()
            .then(updatedOrder => {
                updatedOrder.
                populate({
                    path : 'student',
                    select: 'sjsuId user',
                    populate : {
                      path: 'user',
                      select: 'fname lname email'
                    }
                }).
                populate('items.item').
                execPopulate().
                then(populatedOrder => {
                    successcb(populatedOrder)
                })
            })
            .catch(err => {
                let message = `Failed to get Order details from the db. ${err.message}`;
                failurecb(message);
            })
        })
        .catch(err => {
            let message = `Unable to update Order in the db. ${err.message}`;
            failurecb(message);
        })
    }
}

queries.getOrderDetailsStudent = (orderId, studentId, successcb, failurecb) => {
    Student.findOne({sjsuId: studentId})
    .select('_id')
    .then(student => {
        Order.findOne({_id:orderId,student: student._id})
        .populate('items.item')
        .exec()
        .then(order => {
            successcb(order)})
        .catch(err => {
            let message = `Failed to get Order details from the db. ${err.message}`;
            failurecb(message);
        })
    })
    .catch(err => {
        let message = `Failed to get Student details from the db. ${err.message}`;
        failurecb(message);
    })
}

queries.getOrderDetailsAdmin = (orderId, successcb, failurecb) => {
    Order.findOne({_id:orderId})
    .populate({
        path : 'student',
        select: 'sjsuId user major year',
        populate : {
          path: 'user',
          select: 'fname lname email'
        }
    })
    .populate('items.item')
    .exec()
    .then(order => {
        successcb(order)})
    .catch(err => {
        let message = `Failed to get Order details from the db. ${err.message}`;
        failurecb(message);
    })
}

queries.getStudentDashboardEvents = (id, successcb, failurecb) => {
    Student.findOne({sjsuId: id})
    .select('_id')
    .then(student => {
        if(student !== null){
            StudentEvent.find({student: student._id})
            .populate('event', 'name points')
            .sort({createdDate:-1})
            .limit(5)
            .exec()
            .then(events => {
                successcb(events);
            })
            .catch(err => failurecb(err,"Student Events"))
        } else {
            successcb([]);
        }
    })
    .catch(err => {
        failurecb(err,"Student")
    })
}

queries.getStudentDashboardApprovedEvents = (id, successcb, failurecb) => {
    Student.findOne({sjsuId: id})
    .select('_id')
    .then(student => {
        if(student !== null){
            StudentEvent.find({student: student._id, status: "Approved"})
            .populate('event', 'name points')
            .sort({updatedDate:-1})
            .limit(5)
            .exec()
            .then(events => {
                successcb(events);
            })
            .catch(err => failurecb(err,"Student Events"))
        } else {
            successcb([]);
        }
    })
    .catch(err => {
        failurecb(err,"Student")
    })
}

queries.getStudentDashboardOrders = (id, successcb, failurecb) => {
    Student.findOne({sjsuId: id})
    .select('_id')
    .then(student => {
        if(student !== null){
            Order.find({student: student._id})
            .sort({createdDate:-1})
            .limit(5)
            .exec()
            .then(orders => {
                successcb(orders)})
            .catch(err => failurecb(err,"Student Orders"))
        } else {
            successcb([])
        }
    })
    .catch(err => {
        failurecb(err,"Student")
    })
}

queries.getStudentDashboardDeliveredOrders = (id, successcb, failurecb) => {
    Student.findOne({sjsuId: id})
    .select('_id')
    .then(student => {
        if(student !== null){
            Order.find({student: student._id, status: "Delivered"})
            .sort({updatedDate:-1})
            .limit(5)
            .exec()
            .then(orders => {
                successcb(orders)})
            .catch(err => failurecb(err,"Student Orders"))
        } else {
            successcb([])
        }
    })
    .catch(err => {
        failurecb(err,"Student")
    })
}

queries.getAdminDashboardPendingApprovalEvents = (successcb, failurecb) => {
    StudentEvent.find({status: "Pending Approval"})
    .populate('student', 'sjsuId')
    .populate('event', 'name points')
    .sort({updatedDate:-1})
    .limit(5)
    .exec()
    .then(events => {
        successcb(events)})
    .catch(err => failurecb(err))
}

queries.getAdminDashboardSubmittedOrders = (successcb, failurecb) => {
    Order.find({status: "Submitted"})
    .populate('student', 'sjsuId')
    .sort({updatedDate:-1})
    .limit(5)
    .exec()
    .then(orders => {
        successcb(orders)})
    .catch(err => failurecb(err))
}

queries.createSuggestedEvent = (event, successcb, failurecb) => {
    Student.findOne({sjsuId: event.student.id})
    .select('_id')
    .then(student => {
        const eventDoc = new SuggestedEvent({
            student: student._id,
            name: event.name,
            description: event.description,
            status: "Pending Approval"
        });
        eventDoc.save()
        .then(suggestedEvent => {
            successcb(suggestedEvent);
        })
        .catch(err => {
            failurecb(err, "Suggested Event");
        })
    })
    .catch(err => failurecb(err,"Student"))
}

queries.getStudentOwnSuggestedEvents = (id, successcb, failurecb) => {
    Student.findOne({sjsuId: id})
    .select('_id')
    .then(student => {
        if(student !== null){
            SuggestedEvent.find({student: student._id})
            .sort({updatedDate:-1})
            .exec()
            .then(events => {
                successcb(events);
            })
            .catch(err => failurecb(err,"Suggested Events"))
        } else {
            successcb([]);
        }
    })
    .catch(err => {
        failurecb(err,"Student")
    })
}

queries.addStudentSuggestedEventComment = (eventId, comment, successcb, failurecb) => {
    SuggestedEvent.findById(eventId)
    .then(event => {
        event.comments.push(comment);
        event.save()
        .then(updatedEvent => {
            updatedEvent
            .populate({
                path : 'student',
                select: 'sjsuId user major year',
                populate : {
                  path: 'user',
                  select: 'fname lname email'
                }
            })
            .execPopulate()
            .then(populatedEvent => {
                successcb(populatedEvent)
            })
        })
        .catch(err => failurecb(err))
    })
    .catch(err => failurecb(err))
}

queries.getStudentsAllSuggestedEvents = (successcb, failurecb) => {
    SuggestedEvent.find()
    .populate({
        path : 'student',
        select: 'sjsuId user major year',
        populate : {
          path: 'user',
          select: 'fname lname email'
        }
    })
    .sort({updatedDate:-1})
    .exec()
    .then(events => {
        successcb(events)})
    .catch(err => failurecb(err))
}

queries.updateStudentSuggestedEventStatus = (event, successcb, failurecb) => {
    SuggestedEvent.findById(event.id)
    .then(eventToUpdate => {
        eventToUpdate["status"] = event.status;
        eventToUpdate["updatedBy"] = `Admin(${event.updatedBy})`;
        eventToUpdate.save()
        .then(updatedEvent => {
            updatedEvent.
            populate({
                path : 'student',
                select: 'sjsuId user major year',
                populate : {
                  path : 'user',
                  select: 'fname lname email'
                }
            }).
            execPopulate().
            then(updatedEvent => {
                successcb(updatedEvent)
            })
            
        })
        .catch(err => {
            let message = `Unable to update Suggested Event in the db. ${err.message}`;
            failurecb(message);
        })
    })
    .catch(err => {
        let message = `Failed to get Suggested Event details from the db. ${err.message}`;
        failurecb(message);
    })
}

queries.getStudentDashboardSuggestedEvents = (id, successcb, failurecb) => {
    Student.findOne({sjsuId: id})
    .select('_id')
    .then(student => {
        if(student !== null){
            SuggestedEvent.find({student: student._id})
            .sort({createdDate:-1})
            .limit(5)
            .exec()
            .then(events => {
                successcb(events);
            })
            .catch(err => failurecb(err,"Suggested Events"))
        } else {
            successcb([]);
        }
    })
    .catch(err => {
        failurecb(err,"Student")
    })
}

queries.getStudentDashboardApprovedSuggestedEvents = (id, successcb, failurecb) => {
    Student.findOne({sjsuId: id})
    .select('_id')
    .then(student => {
        if(student !== null){
            SuggestedEvent.find({student: student._id, status: "Approved"})
            .sort({updatedDate:-1})
            .limit(5)
            .exec()
            .then(events => {
                successcb(events);
            })
            .catch(err => failurecb(err,"Suggested Events"))
        } else {
            successcb([]);
        }
    })
    .catch(err => {
        failurecb(err,"Student")
    })
}

queries.getAdminDashboardPendingApprovalSuggestedEvents = (successcb, failurecb) => {
    SuggestedEvent.find({status: "Pending Approval"})
    .populate('student', 'sjsuId')
    .sort({updatedDate:-1})
    .limit(5)
    .exec()
    .then(events => {
        successcb(events)})
    .catch(err => failurecb(err))
}

module.exports = queries;
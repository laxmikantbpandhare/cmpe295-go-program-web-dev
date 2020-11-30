var jwt = require("jsonwebtoken");
const {secret} = require('../config/config');
const enums = require('./enum');
const USER_TYPE_ENUM = enums.USER_TYPE_ENUM;
const util = {};

util.getusertype = (token) => {
    const splittedToken = token.split(' ')[1];
    const decoded = jwt.verify(splittedToken, secret);
    return decoded.userType;
}

util.isUserAdmin = (token) => {
    const userType = util.getusertype(token);
    return userType === USER_TYPE_ENUM.ADMIN;
}

util.isUserStudent = (token) => {
    const userType = util.getusertype(token);
    return userType === USER_TYPE_ENUM.STUDENT;
}

util.isUserManager = (token) => {
    const userType = util.getusertype(token);
    return userType === USER_TYPE_ENUM.MANAGER;
}

util.isUserManagerOrAdmin = (token) => {
    const userType = util.getusertype(token);
    return userType === USER_TYPE_ENUM.MANAGER || userType === USER_TYPE_ENUM.ADMIN; 
}

util.isUserStudentOrManagerOrAdmin = (token) => {
    const userType = util.getusertype(token);
    return userType === USER_TYPE_ENUM.MANAGER || userType === USER_TYPE_ENUM.ADMIN || userType === USER_TYPE_ENUM.STUDENT; 
}

module.exports = util;
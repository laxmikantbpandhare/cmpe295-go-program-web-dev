var jwt = require("jsonwebtoken");
const {secret} = require('../config/config');
module.exports = token =>{
    const splittedToken = token.split(' ')[1];
    const decoded = jwt.verify(splittedToken, secret);
    return decoded.id;
}
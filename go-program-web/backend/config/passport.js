"use strict";
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require('../models/user');
const {secret} = require('./config');

// Setup work and export for the JWT passport strategy
module.exports = function(passport) {
  var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
  };
  passport.use(
    new JwtStrategy(opts, function(jwt_payload, callback) {
      User.findOne({id:jwt_payload.id, email: jwt_payload.email})
      .then(user => {
          callback(null, user);
      })
      .catch(err => callback(err, false));
    },function(err) {
          return callback(err, false);
        }
      )
    );
  }
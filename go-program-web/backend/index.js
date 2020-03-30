var express = require('express');
var app = express();
var cors = require('cors');
var passport = require("passport");
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {database, frontendURL} = require('./config/config');
var mongoose = require('mongoose');

var user = require('./routes/user');
// var admin = require('./routes/admin');
// var student = require('./routes/student');
// var upload = require('./routes/upload');

//use cors to allow cross origin resource sharing
app.use(cors({ origin: `${frontendURL}`, credentials: true }));
app.use(cookieParser());

//Allow Access Control
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', `${frontendURL}`);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
  });

app.use(bodyParser.json());

const connectDB = async () => {
    try {
      await mongoose.connect(database, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        poolSize: 100
      });
      console.log("MongoDB connected successfully");
    } catch (err) {
      console.log("Could not connect to MongoDB", err);
    }
  };
  connectDB();

app.use('/user', user);
// app.use('/admin', admin);
// app.use('/student', student);
// app.use('/upload', upload);

app.use(passport.initialize());
require("./config/passport")(passport);

//start your server on port 3101
app.listen(3001);
console.log("Server Listening on port 3001.");

module.exports = app;

//CRUD Operations using mongoose methods


var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
// const nodemailer = require('nodemailer')
const mongoose = require('mongoose');
var session = require("express-session");

const {MongoClient} = require('mongodb');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var usersListRouter = require('./routes/userslist')
var itemsRouter = require('./routes/items')
var cartRouter=require('./routes/cart')
var orderRouter = require('./routes/orders')


require('dotenv').config()

var app = express();

app.use(cors());
app.options("*", cors());

app.use((req, res, next) => {

res.header("Access-Control-Allow-Origin", "*");

res.setHeader("Access-Control-Allow-Origin", "*");

 res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");

 res.setHeader("Access-Control-Allow-Headers", [
 "Content-Type",
 "Authorization",
 ]);

 res.header("Access-Control-Allow-Headers", ["Content-Type", "Authorization"]);

next();

});

main()
.then((res)=>console.log("Database Connected"))
.catch((err)=>console.log(err))

async function  main(){
  const connectionUrl = 'mongodb+srv://tejaswinimukthapuram:1ZuboX0LX40LgsZp@cluster0.rmotneg.mongodb.net/sampleUsersList?retryWrites=true&w=majority';

  await mongoose.connect(connectionUrl)
 }



// const dbName = 'my-db';
// const url="mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1";

// const client = new MongoClient("mongodb://127.0.0.1:27017")

// client.connect()
// .then((result)=>console.log("Database connected"))
// .catch((err)=>console.log("Connection failed"))

// mongoose.connect(url, {})
// .then((result)=>console.log("database connected"))
// .catch((err)=>console.log(err))



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');



// app.use(
//   session({
//     name:"myCookie",
//     secret: 'some secret',
    
//     cookie: {
//       maxAge: 1000 * 60 * 60 * 24,
//       path:'/userslist',
//       secure:false,
//        // 24 hours
//     },
//     resave: true,
//     saveUninitialized: false,
//   })
// );


// app.use(session({
//   genid: function(req) {
//     return genuuid() // use UUIDs for session IDs
//   },
//   resave: true,
//   saveUninitialized: false,
//   secret: 'some secret'
// }))
// app.use(cors());
app.use(logger('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/userslist', usersListRouter)
app.use('/items', itemsRouter)
app.use('/cart', cartRouter)
app.use('/orders', orderRouter);






// let transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false, // upgrade later with STARTTLS
//   auth: {
//     user: "username",
//     pass: "password",
//   },
// })


// // transporter.verify(function (error, success) {
// //   if (error) {
// //     console.log(error);
// //   } else {
// //     console.log("Server is ready to take our messages");
// //   }
// // });







// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// app.listen(3008, ()=>{
//   console.log("App listening on port 3008")
// })




module.exports = app;

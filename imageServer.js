

//SAMPLE SERVER FOR SAVING AN IMAGE IN DATABASE


var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const _ = require('lodash');
const mongoose = require('mongoose');
const imageModal = require('./models/imagemodal');
const cors = require('cors')



// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// var usersListRouter = require('./routes/userslist')

var server = express();




main()
.then(res=>console.log("Database connected"))
.catch((err)=>console.log(err))


async function main(){
    const connectionUrl = "mongodb+srv://tejaswinimukthapuram:1ZuboX0LX40LgsZp@cluster0.rmotneg.mongodb.net/imageDb?retryWrites=true&w=majority";
    await mongoose.connect(connectionUrl)
}



// view engine setup
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'jade');

//server.use(logger(':method :url'));
server.use(cors());
server.use(logger('dev'));
server.use(express.json());
 server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());
server.use(express.static(path.join(__dirname, 'public')));


// app.use('/', indexRouter);
// app.use('/users', usersRouter);
// app.use('/userslist', usersListRouter)



//GET IMAGE DATA FROM DATABASE
server.get('/image', async function(req, res, next){
    const data = await imageModal.find({})
    try{
        // console.log(data)
        res.status(200).send(data)
    }
    catch(err){
        // console.log(err)
        res.send(err)
    }
})



//CREATE NEW IMAGE DATA IN DATABASE
server.post("/image", async function(req, res, next){
    const imageName = req.body.imageName;
    const image = req.body.image;
    const imageDetails = new imageModal(req.body)
   const data = await imageDetails.save()
   try{
    // console.log(data)
    res.status(200).send(data)
   }
   catch(err){
    // console.log(err)
    res.send(err)
   }


})























// catch 404 and forward to error handler
server.use(function(req, res, next) {
  next(createError(404));
});

// error handler
server.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});






server.listen(3005, ()=>{
    console.log("server is listening to port: 3005")
});

// module.exports = server;



//CRUD Operations using mongodb methods


var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const _ = require('lodash');
const mongoose = require('mongoose');

const {MongoClient} = require('mongodb');
const {ObjectId} = require('mongodb');

const session = require("express-session");

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// var usersListRouter = require('./routes/userslist')

var server = express();




// const dbName = 'my-db';
const url="mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1";

const client = new MongoClient("mongodb://127.0.0.1:27017/db")

client.connect()
.then((res)=>console.log("Database connected"))
.catch((err)=>console.log("Connection failed"))

// mongoose.connect(url, {})
// .then((result)=>console.log("database connected"))
// .catch((err)=>console.log(err))



// view engine setup
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'jade');

//server.use(logger(':method :url'));
server.use(logger('dev'));
server.use(express.json());
 server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());
server.use(express.static(path.join(__dirname, 'public')));

server.use(
    session({
      name:"myCookie",
      secret: 'some secret',
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        // samaeSite:true,
        secure:false,
         // 24 hours
      },
      resave: true,
      saveUninitialized: false,
    })
  );





// app.use('/', indexRouter);
// app.use('/users', usersRouter);
// app.use('/userslist', usersListRouter)

// catch 404 and forward to error handler
// server.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// server.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });



server.get("/users", async function(req, res, next){
    // console.log(req.session)
   
    // console.log("hi");
    //  console.log(req.body);
    
    const result = client.db("my-db").collection("sample").find({})
    const results=await result.toArray();
    res.send(results)
    // console.log(results);
    // res.send(result)
   
    // .then((data)=>res.send(data))
    // .catch((err)=>console.log(err.message))


})



server.get("/users/:id", async function(req, res, next){
    console.log(req.session)
    const {userId} = req.session
    console.log(userId)
    console.log("Hello");
    const id = _.get(req, "params.id", null)
   
    console.log(id)
    
   const result = await client.db("my-db").collection("sample").findOne( {_id: new ObjectId(id) })   //_id: new ObjectId(id)

//    .then((data)=>res.send(data))
//    .catch((err)=>res.send(err))
    console.log(result);
     res.send(result);
})


//METHOD TO GET USERS WHOSE ROLE IS GUEST
server.get('/users/agr', async function(req, res){
    const result = client.db("my-db").collection("sample").aggregate([{$match:{role:"admin"}}])
    const results=await result.toArray();
    res.send(results)
})





//get distinct users 
server.get("/users/:role", async function(req, res){

    const role = _.get(req, "body.role", null)
    console.log(role)
    
    try{
        console.log(role)
        await client.db("my-db").collection("sample").distinct(role)
        .then((data)=>res.send(data))
        .catch((err)=>res.send(err))
        // const data =  client.db('my-db').collection("sample").find({})
        // const results = result.toArray()
        // res.send(results)

    }
    catch(err){
        res.send(err)
    }
})


server.post("/users/login", async function(req, res){
    // console.log(req.session)
    const username = req.body.username
    const result = await client.db("my-db").collection("sample").findOne( {username:username})
    
    req.session.userId = result._id
    console.log(result) 
    console.log(req.session)
})





server.post("/users", async function(req, res, next){
    console.log(req.body);
    const username = req.body.username
    const password = req.body.password
    const role = _.get(req, "body.role", null)

    const result = await client.db("my-db").collection("sample").findOne({username:username})
    if(result===null){
                await client.db("my-db").collection("sample").insertOne({username:username, password:password, role:role})
                .then((data)=>res.send(data))
                .catch((err)=>res.send(err))
     }
     else{
        res.send("User Already Exist")
     }
    
    // try{
    //     const result = await client.db("my-db").collection("sample").findOne({username:username})
    //     console.log(result);
    //     res.send(result);
    //     if(result===null){
    //         await client.db("my-db").collection("sample").insertOne({username:username, password:password})
    //     }
    // }
    // catch{
    //     res.send(err);
    // }
})




//udating items using updateOne
server.put("/users/:id", async function(req, res, next){
    const username = req.body.username
    const password = req?.body?.password
    const id = _.get(req, "params.id", null)
    console.log(id)
    console.log(username)
   
    try{
        const data = await client.db("my-db").collection("sample").updateOne({ _id:  new ObjectId(id)}, {$set:{username: username, password:password}}) //, {upsert:true}
        const result = client.db("my-db").collection("sample").find({})
        const results=await result.toArray();
        res.send(results)
        console.log(data)
        // console.log(result);
    }
    catch(err){
        res.send(err)
    }

})


//Modifying using findAndModify  not working
server.put("/users/mod/:id", async function(req, res, next){
   
    const username = req.body.username
    const password = req?.body?.password
    const id = _.get(req, "params.id", null)
    // console.log(id)
    // console.log(username)
   
    try{
      
        const data = await client.db("my-db").collection("sample").findAndModify({query:{ _id:  new ObjectId(id)}, update:{$set:{username: username, password:password}, new:true}}) //, {upsert:true}
        const result = await client.db("my-db").collection("sample").find({}).toArray();
       
        res.send(result)
        console.log(data)
        console.log("I am findAndModify3")
        // console.log(result);
    }
    catch(err){
        res.send(err)
    }

})






server.delete("/users/:id", async function(req, res, next){
    const id = _.get(req, "params.id", null)
    try{
        const result = await client.db("my-db").collection("sample").deleteOne({_id:new ObjectId(id)})
        const data = client.db("my-db").collection("sample").find({})
        const results=await data.toArray();
        res.send(results)
        
    }
    catch(err){
        res.send(err)
    }
  
})


//Delete all 

server.delete("/users", async function(req, res){

    try{
        const result = await client.db("my-db").collection("sample").deleteMany()
        const data = await client.db('my-db').collection("sample").find({})
        const results = data.toArray()
        res.send(results)
    }
    catch(err){
        res.send(err)
    }
})

//Delete only matches

server.delete("/users", async function(req, res){

    try{
        const result = await client.db("my-db").collection("sample").deleteMany({username:"John"})
        const data = await client.db('my-db').collection("sample").find({})
        const results = data.toArray()
        res.send(results)
    }
    catch(err){
        res.send(err)
    }
})




server.listen(3000, ()=>{
    console.log("server is listening to port: 3000")
});

// module.exports = server;

const UserModel = require('../models/userslist');
const _ = require('lodash');
const Joi = require("joi")
const nodemailer = require('nodemailer')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
// const session = require("express-session");




//the below code throws an error that find no longer accepts a callback
// const getUsers =  function(req, res, next){
//     UserModel.find({},  function(err, data){
//          res.send(data)
       
//     })
// }


let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: "tejaswiniagr96@gmail.com",
      pass: "zssdntmktgdwxrsi",
    },
  })

//   let options = {
//     from :"tejaswiniagr96@gmail.com",
//     to:"tejaswinimukthapuram123@gmail.com",
//     subject:"Test mail",
//     text:"I am the mail sent from nodemailer for successful registration",
//     html:`<h1>Hello Welcome to our application</h1>
//     <img src="cid:food" width="200px>
//     <buton>Click Here</button>`,
//     attachments:[
//         {
//             filename:"food.jpg",
//             path:"https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=600",
//             cid:"food"
//         }
//     ] 
// }

// transporter.sendMail(options, function(err, info){
//     if(err){
//         console.log(err)
       
//     }else{
//         console.log("Mail sent")
        
//     }
// })
  
  
  // transporter.verify(function (error, success) {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log("Server is ready to take our messages");
  //   }
  // });





const getUsers =  function(req, res, next){
    console.log(req.session)
    console.log(req.cookies)

    console.log("Hello")
     UserModel.find({})
     .then((data)=>{
        //  console.log(data)
        console.log(req.sessionID)
        res.cookie("myCookie", data);
        res.send(data)
     })
     .catch((err)=>{
        console.log(err)
        res.send(err)
     })
        // return res.send("I am from users controller")
       
    
}

const logoutUser = async function(req, res){
    console.log("HEllo")
    req.session.destroy();
    // res.redirect('/')
    console.log(req.session)
    res.send("Session destroyed")
} 


const generateAccessToken = (payload)=>{
    return jwt.sign(payload, process.env.SECRET_CODE)
}


const getUserBasedOnDetails = async function(req, res, next){
    //  console.log(req.session)
    const body = _.get(req, "body", {})
    const username = req.body.username
    const email=req.body.email
    const password = req.body.password
    // console.log(password);
    // console.log(body)
    const data = await UserModel.findOne({username:username})
    try{
        // res.send(data)
        //  console.log(data)
         if(data===null){
            res.send("Invalid User please Register")
         }else{
            
            // req.session.userId = data._id.toString()
            // console.log(req)
            // console.log(req.sessionID)
            // console.log(req.sessionID)
            // res.cookie("sessionCookie", "hello", { maxAge: 900000, httpOnly: true })
            // console.log(req.genuuid)
            // console.log(req.session.userId)
              const token=generateAccessToken({username:username,email:email,password:password})
              const refreshtoken = jwt.sign({username:username,email:email,password:password}, process.env.REFRESH_SECRET_CODE)
          
            res.cookie('refreshtoken',refreshtoken,{
                httpOnly:true,  //makes sure that we cant modify this cookie with javascript
                path:'/refresh_token'  //we dont want to send this cookie with each request,we just do it when we are on rerefresh_token end point
        
            }

           
            
            )
            res.send({token:token})
         }
        
    }
    catch(err){
        res.send(err)
        res.send("Invalid user")
    }
}



const sampleGet = function(req, res, next){
    console.log("I am sample Page")
}








const getUser = function(req, res, next){
    const id = _.get(req, "params.id", null)
    UserModel.findById(id)
    .then((data)=>res.send(data))
    .catch((err)=>res.status(404).send(err))
}


// const updateUser = function(req, res, next){
//     const id = _.get(req, "params.id", null)
//     const body = _.get(req, "body", {})
//     UserModel.findByIdAndUpdate(id, body)
//     .then((data)=>res.send(data))
//     .catch((err)=>res.send(err))
// }


const updateUser = async function(req, res, next){
    
    const id = _.get(req, "params.id", null);
    // console.log(req.params.id)
    //  console.log(req.params.body)
    const body = _.get(req, "body", {});
    try{
       await  UserModel.findByIdAndUpdate(id, body)
         return res.send(await UserModel.find())
    }
    catch(err){
        res.send(err)
    }
  
                             
    }






    const createUser = async function(req, res, next){


        const schema = Joi.object().keys({
            username:Joi.string().required(),
            email:Joi.string().required(),
            password:Joi.string().required(),
            number:Joi.number().required()
        })

        const {error} = schema.validate(req.body)

        const errorDetails = _.get(error, "details", [])

        if(!_.isEmpty(errorDetails)){
            return res.send(error.details)
        }

        const body = _.get(req, "body", {})

        const username = req.body.username
        const password  = req.body.password

        const hashedPassword = await bcrypt.hash(password, 10);

        
            const result = await UserModel.findOne({username:username})

            console.log(result);

            if (result==null){
               
                let options = {
                    from :"tejaswiniagr96@gmail.com",
                    to:"tejaswiniagr96@gmail.com",
                    subject:"Test mail",
                    text:`Welcome ${username} you have registered Successfully`,
                    html:`<h1>Welcome ${username} you have registered Successfully</h1>
                    <img src="cid:food" width="200px>
                    <buton>Click Here</button>`,
                    attachments:[
                        {
                            filename:"food.jpg",
                            path:"https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=600",
                            cid:"food"
                        }
                    ] 
                }
                
                transporter.sendMail(options, function(err, info){
                    if(err){
                        console.log(err)
                       
                    }else{
                        console.log("Mail sent")
                        
                    }
                })

                const body = {...req.body, password:hashedPassword}
                console.log(body)
                const newUser =  new UserModel(body)
                newUser.save()
                .then((data)=>{
                    console.log(data)
                    // res.send(data)
                    // transporter.sendMail(options, function(err, info){
                    //     if(err){
                    //         console.log(err)
                    //         res.send(err)
                    //     }else{
                    //         console.log("Mail sent")
                    //         res.send(err)
                    //     }
                    // })
                    res.send("User Registered Successfully")
                })
                .catch((err)=>res.status(404).send(err))
            }else{
                res.send("User Already exist")
            }
        
          
        

       
    }




    const deleteUser = async function(req, res){

        const id = _.get(req, "params.id", null)

        UserModel.findByIdAndDelete(id)
        try{
            const data = await  UserModel.find()
            res.send(data)
        }
        catch(err){
            res.send(err)
        }
    }

  const deleteAllUSers =  async function(req,res){
//    console.log("Hi")
    try{
        await UserModel.deleteMany({})
        const data = await  UserModel.find()
        res.send(data)
        console.log("Data deleted successfully")
    }
    catch(err){
        res.send(err)
    }
  }

module.exports = {getUsers, updateUser, getUser,  createUser,  deleteUser, sampleGet, getUserBasedOnDetails, logoutUser,  deleteAllUSers  };

// console.log(module)
var express=require('express');
const router = express.Router();
router.use(express.json())
const orderController = require('../controllers/orders')
const jwt=require('jsonwebtoken')
require('dotenv').config();



const authenticateToken = (req, res, next)=>{
    // const authHeader = req.headers['authorization']
    // console.log(req)
    const authHeader = req.headers.authorization
    // console.log(authHeader,"headers")
    const token = authHeader && authHeader.split(" ")[1]
    // const token = req.headers?.authorization?.split(" ")[1]
    // console.log(token,"token")
    
    if(token===null){
        // return res.sendStatus(401)
        res.send("you are not authorised")
    }
    // console.log("Token is received")
    jwt.verify(token, process.env.SECRET_CODE, function(err, user){
                if(err){

                    // res.sendStatus(403)
                    // console.log(token,"hello")
                    // console.log(err)
                    res.send(err)
                    // res.send("errrrrrrrrrrrrrrr")
                }else{
                    req.user = user;
                    next();
                }

               
        })
    // else{
    //     const user=jwt.verify(token, process.env.SECRET_CODE) 
    //     console.log(user)
    //     req.user = user;
    //         next();
    // }
    

    
    
}





router.get("/", authenticateToken, orderController.getOrders);
router.post('/', authenticateToken, orderController.createOrder);
router.put('/:id', authenticateToken, orderController.cancelEachOrder)

module.exports = router;
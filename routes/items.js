const express = require('express')
const itemsController = require('../controllers/items')
const jwt = require('jsonwebtoken')

const router = express.Router();


const authenticateToken = (req, res, next)=>{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]
    // const token = req.headers?.authorization?.split(" ")[1]
    console.log(token)
    
    if(token===null){
        // return res.sendStatus(401)
        res.send("you are not authorised")
    }
    console.log("Token is received")
    jwt.verify(token, process.env.SECRET_CODE, function(err, user){
                if(err){

                    // res.sendStatus(403)
                    res.send(err)
                }else{
                    req.user = user;
                    next();
                }

               
        })
    
    
}

router.post('/refreshtoken', function(){
   const refreshtoken = req.cookies.refreshToken

    

    if(!refreshtoken){
        return res.send(403);
    }

    jwt.verify(refreshtoken , process.env.REFRESH_SECRET_CODE, (err, user)=>{
        if(err){
            return res.sendStatus(403);
        }

        // const token = generateAccessToken(user)
        // return res.send({token:token});
        req.user = user;
    })
})


router.get('/',  itemsController.getItems)
router.get('/:id',itemsController.getItem)
router.post('/',  authenticateToken,itemsController.createItems)
router.put('/:id',  authenticateToken,itemsController.updateItem)
router.delete('/:id', authenticateToken, itemsController.deleteItem)






module.exports = router;
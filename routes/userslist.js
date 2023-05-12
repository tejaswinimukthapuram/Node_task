var express = require('express');
var router = express.Router()
var logger = require('morgan');
const usersController = require('../controllers/userslist')

 router.get('/', usersController.getUsers);
 router.get('/logout', usersController.logoutUser)
 router.get('/:id', usersController.getUser)
 
 router.post('/login', usersController.getUserBasedOnDetails)
 
 router.get("/sample", usersController.sampleGet) //all these routings should be in same order if I use this sampleGet router at the bottom it doesn't fetch any data

 router.put('/:id', usersController.updateUser)
 router.post('/', usersController.createUser)
 router.delete('/deleteall', usersController.deleteAllUSers )
 router.delete('/:id', usersController.deleteUser)
 
 




 module.exports = router;
const ItemsModal = require('../models/itemsModal')
const Joi = require('joi')
const _ = require('lodash');


const getItems = async (req, res)=>{

    try{
        const data = await ItemsModal.find()
        res.send(data)
    }
    catch(err){
        res.send(err)
    }
}


const getItem= async (req,res)=>{
    try{
        const data = await ItemsModal.find({_id:req.params.id})
        res.send(data)
    }
    catch(err){
        res.send(err)
    }
} 




const createItems = async function(req, res){

    // const schema = Joi.object().keys({
    //     title:Joi.string().required(),
    //     description:Joi.string().required(),
    //     price:Joi.number().required(),
    //     image:Joi.string().required(),
    //     category:Joi.string().required(),
    //     // rating:Joi.number().required(),
    //     gender:Joi.string().required(),
    //     // quantity:Joi.number().required()
    // })

    // const {error} = schema.validate(req.body)
    // const errorDetails =  _.get(error, "details", [])

    // if(!_.isEmpty(errorDetails)){
    //     console.log(errorDetails)
    //     return res.send(errorDetails)
    // }

    try{
       const item = new ItemsModal(req.body)
       item.save()
       .then((data)=>{
        console.log(data)
        res.send(data)
       })
       .catch((err)=>res.send(err))

    }
    catch(err){
        res.send(err)
    }

}



const updateItem = async function(req, res){
    const id = req.params.id
  

    try{
       await ItemsModal.findByIdAndUpdate(id, req.body)
       await ItemsModal.find()
       .then((data)=>res.send(data))
       .catch((err)=>res.send(err))

    }
    catch(err){
        res.send(err);
    }

}



const deleteItem = async function(req, res){

    const id = req.params.id

    await ItemsModal.findByIdAndDelete(id);
    
    try{
       
        const data = await ItemsModal.find()
        res.send(data)
    }
    catch(err){
        res.send(err);
    }
  


}





module.exports =  {getItems, getItem,createItems, updateItem, deleteItem}
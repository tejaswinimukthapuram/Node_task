const _ = require("lodash");
const Joi = require("joi");
const { ObjectId } = require("mongodb");
const orderModel = require('../models/ordersModal');

const getOrders = async (req, res)=>{
    const email = req.user.email;
    try{
        const data = await orderModel.find({userId:email})
        res.send(data);
    }
    catch(err){
        res.send(err)
    }
   
}



const createOrder = async (req, res) => {

    const orderedProductsArr = req.body.productsArr
    // console.log(req.user.email); //I WILL GET THIS BY LOGGED IN USER FROM AUTHENTICATION IN CART ROUTING
    //const schema = Joi.object().keys({
    //   productDetails: Joi.object().required(),
    //});
  
    // const { error } = schema.validate(req.body);
  
    // const errorDetails = _.get(error, "details", []);
  
    // if (!_.isEmpty(errorDetails)) {
    //   return res.send(error.details);
    // }
  
    try {
      const userOrder = await orderModel.findOne({ userId: req.user.email });
  console.log(userOrder)
      if (userOrder === null) {
        const newUserOrder = await orderModel.create({
          userId: req.user.email,
          productsArr: orderedProductsArr ,
        });
        res.send(newUserOrder);
      } else if (userOrder !== null) {

        for(let each of orderedProductsArr){
          userOrder.productsArr.push(each)
        }
    
       
        await userOrder.save()
        res.send(userOrder);
      }
    } catch (err) {
      res.send(err);
    }
  };


  const cancelEachOrder = async (req, res)=>{

    // const schema = Joi.object().keys({
    //   producsArr: Joi.object().required(),
    // });
  
    // const { error } = schema.validate(req.body);
  
    // const errorDetails = _.get(error, "details", []);





    const orderedItemId = req.params.id
    console.log(orderedItemId)
    const updatedProduct = req.body.updatedProduct;
    console.log(updatedProduct)
    const userOrder = await orderModel.findOne({userId:req.user.email})
  
      // console.log(userOrder.productsArr)
    const cancelItemIndex = userOrder.productsArr.findIndex((each)=>{
      return each._id==orderedItemId
    })


    userOrder.productsArr.splice(cancelItemIndex, 1, updatedProduct)



    // console.log(userOrder.productsArr);
    await userOrder.save();
    res.send(userOrder)
  
  }

  module.exports = { getOrders, createOrder, cancelEachOrder }
  


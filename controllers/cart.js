const cartModel = require("../models/cartModel");
const _ = require("lodash");
const Joi = require("joi");
const { ObjectId } = require("mongodb");
const moment = require("moment");

const getCartItems = async (req, res) => {
  const userId = req.user.email;
  try {
    const data = await cartModel.find();
    res.send(data);
  } catch (err) {
    res.send(err);
  }
};

const getEachCartItems = async (req, res) => {
  const email = req.user.email;
  try {
    const data = await cartModel.find({ userId: email });
    res.send(data);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const createCartItems = async (req, res) => {
  console.log(req.user.email); //I WILL GET THIS BY LOGGED IN USER FROM AUTHENTICATION IN CART ROUTING
  const schema = Joi.object().keys({
    productDetails: Joi.object().required(),
  });

  const { error } = schema.validate(req.body);

  const errorDetails = _.get(error, "details", []);

  if (!_.isEmpty(errorDetails)) {
    return res.send(error.details);
  }

  try {
    const userCart = await cartModel.findOne({ userId: req.user.email });

    if (userCart === null) {
      const newCart = await cartModel.create({
        userId: req.user.email,
        productsArr: [req.body.productDetails],
      });
      res.send(newCart);
    } else if (userCart !== null) {
      const productId = req.body.productDetails._id;
      const productIndex = userCart.productsArr.findIndex((each) => {
        return each._id == productId;
      });
      if (productIndex !== -1) {
        const existingQuantity = userCart.productsArr[productIndex].quantity;
        userCart.productsArr[productIndex].quantity =
          req.body.productDetails.quantity;
        const cart = await userCart.save();
        res.send({
          cart: cart,
          message:
            "This item is already present in your cart we will just update the quantity",
        });
      } else {
        userCart.productsArr.push(req.body.productDetails);
        const cart = await userCart.save();
        res.send(cart);
      }
    }
  } catch (err) {
    res.send(err);
  }
};

const updateMany = async (req, res) => {

const updatedProductsArr = req.body.updatedProductsArr 
  const date = moment().format("dddd, MMMM Do YYYY");
  console.log(updatedProductsArr);
  console.log(req.user.email);

  try{
    const userCart = await cartModel.findOne({'userId': req.user.email });

   

     const finalOrder = await cartModel.findOneAndUpdate({userId: req.user.email, productsArr:updatedProductsArr})
  


     console.log(finalOrder)
 

  //   res.send(userCart.productsArr)
  // await newUserCart.save();
  res.send(finalOrder);
  const userCart1 = await cartModel.findOne({'userId': req.user.email });
  console.log(userCart1)
  
  //   userCart.save();
  
  //   res.send(userCart)
  }
  catch(err){
    res.send(err)
  }




};

const deleteItem = async (req, res) => {
  const cartItemId = req.params.id;
  try {
    console.log("Deleting initialised");

    const userCart = await cartModel.findOne({ userId: req.user.email });

    const productIndex = userCart.productsArr.findIndex((each) => {
      return each._id == cartItemId;
    });
    console.log(`Delete Item Index = ${productIndex}`);

    userCart.productsArr.splice(productIndex, 1);
    console.log(userCart.productsArr);
    const deletedCart = await userCart.save();
    res.send(deletedCart);
  } catch (err) {
    res.send(err);
  }
};


const deleteCartItems = async (req, res)=>{
  try{
    const userCart = await cartModel.findOne({ userId: req.user.email });
    userCart.productsArr.splice(0,  userCart.productsArr.length);
    const newUserCart=await userCart.save();
    console.log(userCart.productsArr, "Hello");
    // res.send("Cart items are removed successfully")
    res.send(newUserCart)
  }
  catch(err){
    res.send(err)
  }
}

const reduceQuantity = async (req, res) => {
  const cartItemId = req.params.id;
  try {
    console.log("Deleting initialised");

    const userCart = await cartModel.findOne({ userId: req.user.email });

    const productIndex = userCart.productsArr.findIndex((each) => {
      return each._id == cartItemId;
    });

    userCart.productaArr[productIndex].quantity =
      req.body.productDetails.quantity - 1;

    const cart = userCart.save();
    res.send(cart);
  } catch (err) {
    res.send(err);
  }
 };



module.exports = {
  getCartItems,
  createCartItems,
  getEachCartItems,
  deleteItem,
  updateMany,
  deleteCartItems
};







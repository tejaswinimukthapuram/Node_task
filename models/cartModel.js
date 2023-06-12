const mongoose = require('mongoose');
const{Schema} = mongoose;

const cartSchema = Schema({
      userId:{type:String},
     
      
    productsArr:[
      {
        productId:String,
        quantity:Number,
        title:String,
        description:String,
        image:String,
        rating:Number,
        price:Number,
        orderedOn:String,
        isOrdered:Boolean,
      }
    ]
})

const CartItem = mongoose.model('CartItem', cartSchema );

module.exports=CartItem;     
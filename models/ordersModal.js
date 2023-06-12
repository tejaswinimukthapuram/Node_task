const mongoose = require('mongoose');
const {Schema} = mongoose;

const orderSchema = Schema({
    userId:{type:String},
     
      
    productsArr:[
        {
            quantity:Number,
            image:String,
            description:String,
            title:String,
            price:Number,
            orderedOn:String,
            isOrdered:Boolean,
            isCancelled:Boolean,
            rating:Number
        }
    ]
    
})


const Order = mongoose.model("Order", orderSchema);

module.exports = Order
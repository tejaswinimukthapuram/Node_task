const mongoose = require('mongoose');
const {Schema} = mongoose;

const itemsSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    price:{
        type:Number
    },
    gender:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
    
    },
    // quantity:{
    //     type:Number,
    //     required:true
    // }
}) 


const Item = mongoose.model("Item", itemsSchema)

module.exports = Item;
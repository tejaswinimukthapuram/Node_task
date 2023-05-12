const mongoose = require("mongoose");
const {Schema} = mongoose;

const imageSchema = new Schema({
    imageName:String,
    imageUrl:String
    // image:Buffer
    
})

const Image = mongoose.model("Image", imageSchema)


module.exports = Image
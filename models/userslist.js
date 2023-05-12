const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcrypt');







const userSchema  = new Schema({
  
    username:String,
    email:String,
    password:String,
   number:Number


})


// userSchema.pre('save', function(next){
//     if(this.isModified('password')){
//         bcrypt.hash(this.password, 10, function(err, hash){
//             if(err){
//                 return err
//             }else{
//                 this.password = hash;
//                 next();
//             }
//         })
//     }
// })


// UserSchema.methods.comparePassword = function(candidatePassword, cb) {
//     bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
//         if (err) return cb(err);
//         cb(null, isMatch);
//     });
// };
  



const User = mongoose.model("User", userSchema);

// console.log(mongoose.model('User'))


module.exports = User;
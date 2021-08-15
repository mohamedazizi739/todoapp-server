
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
 { name: {type: String,required: true}, 
   email: {type: String,required: true}, 
   password: {type: String,required: true},
   tasks:[{taskName:String}],
   photo:{type: String} });
const user = mongoose.model('user', userSchema);
module.exports=user
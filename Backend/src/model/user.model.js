const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique : [true,"Username already taken."]
    },
    email:{
        type:String,
        required:true,
        unique : [true,"account already exist with this email"]
    },
    password:{
        type:String,
        required:true
    }
})

const userModel = mongoose.model("user details",userSchema);

module.exports=userModel;
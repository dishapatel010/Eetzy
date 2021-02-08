const mongoose= require('mongoose')
const Schema=mongoose.Schema

const userschema= new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
})

const User=mongoose.model('Users',userschema)
module.exports = User
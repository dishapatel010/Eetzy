const mongoose=require('mongoose')
const Schema=mongoose.Schema
const sharedfileschema=new Schema({
    owner:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    path:{
        type:String,
        required:true
    },
    id:{
        type:Number,
        required:true
    }
})

const Shared=mongoose.model('Shared',sharedfileschema)
module.exports=Shared

const mongoose=require('mongoose')
const { stringify } = require('querystring')
const Schema = mongoose.Schema
const fileschema = new Schema({
    id:{
        type:Number,
        required:true,
    },
    name:{
        type:String,
        required:true
    },
    path:{
        type:String,
        required:true,
    }
})

const File=mongoose.model('CLIs',fileschema)
module.exports=File
const mongoose= require('mongoose')
const Schema=mongoose.Schema
const cliuserschema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    files:{
        type:Array,
        request:true
    }
})
const CLIU=mongoose.model('CLIU',cliuserschema)

module.exports=CLIU;
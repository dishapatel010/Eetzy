const router=require('express').Router()
const User=require('../models/users')
const CLIU=require('../models/cliuser')
const Shared=require('../models/shared')
router.get('/refresh',(req,res)=>{
    // User.deleteMany({})
    // .then(resp=>console.log(resp))
    // .catch(err=>console.log(err))
    // CLIU.deleteMany({})
    // .then(resp=>console.log(resp))
    // .catch(err=>console.log(err))
res.end()
})
router.get('/showdatabase',(req,res)=>{
    Shared.find()
    .then(resp=>res.json(resp))
    .catch(err=>console.log(err))
})

router.get('/test',(req,res)=>{
     Shared.deleteMany({})
    .then(resp=>console.log(resp))
    .catch(err=>console.log(err))
})


module.exports=router
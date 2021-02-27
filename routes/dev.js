const router=require('express').Router()
const User=require('../models/users')
const CLIU=require('../models/cliuser')
router.get('/refresh',(req,res)=>{
    User.deleteMany({})
    .then(resp=>console.log(resp))
    .catch(err=>console.log(err))
    CLIU.deleteMany({})
    .then(resp=>console.log(resp))
    .catch(err=>console.log(err))
res.end()
})


module.exports=router
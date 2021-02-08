const router = require('express').Router()
const path=require('path')
const jwt = require('jsonwebtoken')
const CLIU=require('../models/cliuser')
const User=require('../models/users')
const jwt_secret="#1AmanKumarM"
router.get('/',(req,res)=>{
    res.json("request came at /")
})

router.get('/find',(req,res)=>{
    res.json("request came at /")
})

router.get('/upload',(req,res)=>{
    res.send("request came at /")
})

router.post('/registeruser',async (req,res,next)=>{
    await User.find({name:req.body.name})
    .then(resp=>{
        if(resp.length===0){
            next()
        }
        res.status(403).send("username is  taken, Try a different one")
    })
    .catch(err=>console.log(err))

},async (req,res)=>{
    
    
    
    const cliuser = new CLIU({
        username:req.body.name,
        files:[]
    })
    cliuser.save()
    .then()
    .catch(err=>res.status(403).send(err))
    const token = jwt.sign(req.body.name,jwt_secret)
    const newuser=new User({
        name:req.body.name,
        password:req.body.password,
    })
    newuser.save()
    .then()
    .catch(err=>res.status(403).send(err))


    res.status(200).json(token)

    var decoded = jwt.verify(token,jwt_secret);
    // res.send(token)
    res.end()
})


router.post('/login',async (req,res)=>{
    await User.find({name:req.body.name})
    .then(resp=>{if(resp[0].password===req.body.password){
        const token = jwt.sign(req.body.name,jwt_secret)
        res.status(200).send(token)
    }})
    .catch(er=>console.log(er))
    res.status(403).send("incorrect password")
    res.end()
})
router.get('/test',(req,res)=>{
    // CLIU.find()
    // .then(ers=>console.log(ers))
    // .catch(err=>console.log(err))
    new User({name:"test",token:"token"}).save()
    .then(ers=>console.log(ers))
    .catch(err=>console.log(err))

})
module.exports=router
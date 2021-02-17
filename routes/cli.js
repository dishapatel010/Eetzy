const router = require('express').Router()
const path=require('path')
const jwt = require('jsonwebtoken')
const CLIU=require('../models/cliuser')
const User=require('../models/users')
const fs=require('fs')
const jwt_secret="#1AmanKumarM"

router.get('/',(req,res)=>{
    res.json("request came at /")
})

router.get('/find',(req,res)=>{
    res.json("request came at /")
})

router.post('/upload',(req,res)=>{
    const username=jwt.verify(req.headers.authtoken,jwt_secret);
    const filename=req.headers.name
    const incfile=req.files.file
    const fileobj={
        name:filename,
        path:`./Clidata/${username}/${filename}`
    }
    incfile.mv(`./Clidata/${username}/${filename}`,function(err){
        if(err){
            res.status(503).send(err);
        }
        CLIU.update({username:username},{ $push: { files:  fileobj  } })
        .then(res=>console.log(res))
        .catch(err=>console.log(err))
        res.status(200).send("file uploaded")
    })

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
    fs.mkdir(`./Clidata/${req.body.name}/`,function(err){
        if (err){
         res.status(503).send("server side error, try again later.")
        }
    })
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
    CLIU.find()
    .then(ers=>console.log(ers[3].files))
    .catch(err=>console.log(err))
    // new User({name:"test",token:"token"}).save()
    // .then(ers=>console.log(ers))
    // .catch(err=>console.log(err))
    

})
module.exports=router
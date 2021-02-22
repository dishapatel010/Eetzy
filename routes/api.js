const router=require('express').Router()
const User=require('../models/users')
const CLIU=require('../models/cliuser')
const jwt=require('jsonwebtoken')
const jwt_sec='#1AmanKumarM'
const fs= require('fs')
router.get('/getfiles',async (req,res)=>{
    const auth_token=req.cookies.authtoken
    const username=jwt.verify(auth_token,jwt_sec)
    await CLIU.findOne({username})
    .then(resp=>res.json(resp.files))
    .catch(err=>console.log(err))
    res.end()
})
router.post('/uploadfiles',async(req,res)=>{
    const auth_token=req.cookies.authtoken
    const username=jwt.verify(auth_token,jwt_sec)
    const filename=req.files.file.name
    const incfile=req.files.file
    const getid=async ()=>{
        var obj;
        await CLIU.findOne({username:username})
        .then(async res=>{
            obj = await res.files.length
        })
        .catch(err=>console.log(err))
        return obj
    } 
    let fileid=await getid()
    const fileobj={
        name:filename,
        path:`./Clidata/${username}/${filename}`,
        id:fileid,
        permission:false
    }
    incfile.mv(`./Clidata/${username}/${filename}`,function(err){
        if(err){
            res.status(503).send(err);
        }
        CLIU.update({username:username},{ $push: { files:  fileobj  } })
        .then(resp=>console.log(resp))
        .catch(err=>console.log(err))
        res.status(200).json({msg:"file uploaded"})
    })
    // console.log(req.files)
})

router.get('/downloadfile/:filename',async (req,res)=>{
    const username=jwt.verify(req.cookies.authtoken,jwt_sec)
    // const file=new File(`./Clidata/${username}/${req.params.filename}`)
    if (fs.existsSync(`./Clidata/${username}/${req.params.filename}`)) {
        res.download(`./Clidata/${username}/${req.params.filename}`)
    } else {
    res.send('something went wrong :?')        
    }
    // console.log(req.params.filename)
})

module.exports=router
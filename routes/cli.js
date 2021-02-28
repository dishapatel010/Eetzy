const router = require('express').Router()
const path=require('path')
const jwt = require('jsonwebtoken')
const CLIU=require('../models/cliuser')
const User=require('../models/users')
const fs=require('fs')
const Shared = require('../models/shared')
const jwt_secret="#1AmanKumarM"

router.get('/getfile/:id',(req,res)=>{
    const id=Number(req.params.id)
    const username=jwt.verify(req.headers.authtoken,jwt_secret)
    CLIU.find({username:username})
    .then(resp=>{
        const all_files=resp[0].files
        for (let i = 0; i < all_files.length; i++) {
            const element = all_files[i];
            if (element.id===id) {
                // const file_to_send=fs.readFileSync(element.path)
                // console.log(String( file_to_send))

                fs.readFile(element.path,function(err,data){
                    console.log(data,typeof data)
                    res.send({name:element.name,file_to_send:data})
                })
                
                break;
            }
            // console.log(element)
            
        }
    })
    .catch(err=>console.log(err))



})

router.get('/showall/:token',(req,res)=>{
    const username=jwt.verify(req.params.token,jwt_secret);
    CLIU.find({username:username})
    .then(resp=>res.send(resp[0].files))
    .catch(err=>res.send(err))
    // console.log(req.headers)
})

router.get('/find',(req,res)=>{
    res.json("request came at /")
})

router.post('/upload',async (req,res)=>{
    console.log("reqcame")
    const username=jwt.verify(req.headers.authtoken,jwt_secret);
    const filename=req.headers.name
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
        CLIU.updateOne({username:username},{ $push: { files:  fileobj  } })
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
})


router.post('/login',async (req,res)=>{
    await User.find({name:req.body.name})
    .then(resp=>{if(resp[0].password===req.body.password){
        const token = jwt.sign(req.body.name,jwt_secret)
        res.status(200).send(token)
    }})
    .catch(er=>{console.log(er)
    res.status(403).send("incorrect password")
    })
})
router.post('/setpermission/:id',async(req,res)=>{
    const id=Number(req.params.id)
    const username=jwt.verify(req.body.authtoken,jwt_secret)
    var found=false;
    await CLIU.findOne({username:username})
    .then(async resp=>{
            for (let i = 0; i < resp.files.length; i++) {
                const element = resp.files[i];
                if (element.id===id) {
                    found =await true
                    const new_instance=new Shared(element)
                    new_instance.owner=username
                    new_instance.save()
                    .then(resp=>res.send("File made public"))
                    .catch(err=>{console.log(err);res.send("File not found.")})  
                    break              
                }
            }

    })
    
    .catch(err=>{console.log(err);res.send("File not found")})
    if(!found){
        res.send("file not found.")
    }
})

router.get('/getremotefile/:id',(req,res)=>{
    const id=Number(req.params.id)
    Shared.findOne({owner:req.headers.user,id:id})
    .then(resp=>{
        fs.readFile(resp.path,function(err,data){
        console.log(data,typeof data)
        res.send({name:resp.name,file_to_send:data})   
    })
    })
    .catch(err=>console.log(err))


})

router.get('/test',(req,res)=>{
    CLIU.find()
    .then(ers=>console.log(ers))
    .catch(err=>console.log(err))
     User.find()
    .then(ers=>console.log(ers))
    .catch(err=>console.log(err))
    res.end()
    

})
router.get('/dc',(req,res)=>{
    CLIU.deleteMany({})
    .then(res=>console.log(res))
    .catch(err=>console.log(err))
    User.deleteMany({})
    .then(res=>console.log(res))
    .catch(err=>console.log(err))
    res.end()
})
module.exports=router
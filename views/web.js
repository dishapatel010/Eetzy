const jwt =require('jsonwebtoken')
const User=require('../models/users')
const CLIU=require('../models/cliuser')
const jwt_secret="#1AmanKumarM"

const WebHome=(req,res)=>{
    const auth_status=req.cookies.authtoken
    if (auth_status) {
        res.redirect('/web/home')
    }
    else{
        res.render('web',{info:"",info1:""})
    }
}
const authmiddleware=(req,res,next)=>{
    const auth_status=req.cookies.authtoken
    if (auth_status) {
        next()
    }
    else{
        res.redirect('/')
    }
}
const Homepost=(req,res)=>{
    const body=req.body
    User.findOne({name:body.username,password:body.password})
    .then(result=>{
        if(result===null){
            res.render('web',{info:'username and password didnt match. Try again ',info1:'if you dont have an account try making one here'})
        }
        else{
            const auth_token=jwt.sign(body.username,jwt_secret)
            res.cookie('authtoken',auth_token,{ maxAge: 900000, httpOnly: true })
            res.redirect('/web/home')
        }
    })
    .catch(err=>console.log(err))
}
const webcreate=(req,res)=>{
    res.render('create')
}
const createacc=(req,res)=>{
    const {username , password} =req.body
    const user_instance=new User({
        name:username,
        password:password
    })
    user_instance.save()
    const userfiles=new CLIU({
        username:username,
        files:[]
    })
    userfiles.save()
    res.json({msg:"Account Created you can login now"})
}

const checkuserexists=(req,res,next)=>{
    const username=req.body.username
    const mode=req.url
    // console.log(mode)
    User.findOne({name:username})
    .then(resp=>{
        if (resp===null) {
            if (mode==='/createacc') {
                next()
            }
        }
        else{
            if (mode==='/createacc') {
                res.status(404).json({msg:"Username already taken"})
            }
        }
    })
    }   
const gethome=(req,res)=>{
    res.render('home')
}
const logout=(req,res)=>{
    res.clearCookie('authtoken')
    res.redirect('/web/')
}

 



module.exports={Home:WebHome,Homepost,webcreate,createacc,checkuserexists,homemiddleware:authmiddleware,gethome,logout}
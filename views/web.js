const User=require('../models/users')

const WebHome=(req,res)=>{
    res.render('web',{info:"",info1:""})
}
const Homepost=(req,res)=>{
    const body=req.body
    User.findOne({username:body.username})
    .then(result=>{
        if(result===null){
            res.render('web',{info:'username and password didnt match',info1:'if you dont have an account try making one here'})
        }
    })
    .catch(err=>res.render('404'))
}
const webcreate=(req,res)=>{
    res.render('create')
}
const createacc=(req,res)=>{
    // const user_instance=new User({
    //     username:username,
    //     password:password
    // })
    
    res.json(res.body)
}

const checkuserexists=(req,res,next)=>{
    const username=req.body.username
    const mode=req.url
    // console.log(mode)
    User.findOne({username})
    .then(resp=>{
        if (resp==null) {
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
module.exports={Home:WebHome,Homepost,webcreate,createacc,checkuserexists}
const express=require('express')
const bodyparser=require('body-parser')
const app=express()
const fileupload=require('express-fileupload')
const mongoose=require('mongoose')
const File=require('./models/cli')
const {getseq,savefile} = require('./functions')

mongoose.connect("mongodb+srv://urlshortner:urlshortner@node.bczjx.mongodb.net/CLI?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology:true})
.then((result)=>{console.log('connected')})
.catch((err)=>console.log(err))
app.set('views','templates')
app.set('view engine','ejs')
app.use(bodyparser.json())
app.use(fileupload())
app.get('/',(req,res)=>{

    res.sendFile(__dirname+'/templates/index.html')
})
app.post('/addfile',async (req,res)=>{

    
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  let file = req.files.file
  let fid=await getseq()
  new File({id:await getseq(),name:file.name,path:`/Data/${file.name}`}).save()
  .then(resp=>fid=resp.id)
  .catch(err=>res.status(500).send(err))
  file.mv(`./Data/${file.name}`,function(err){
      if (err) {
          return res.status(500).send(err)
      }
      res.send('Uploaded file id - '+fid)
  })
})

app.get('/viewbyid/:id',(req,res)=>{

    File.find({id:req.params.id})
    .then(resp=>{
    res.sendFile(__dirname+resp[0].path)
    })
    .catch(err=>console.log(err))
})

app.get('/viewbyname/:name',async (req,res)=>{
    var allfiles;
    var nameparam=req.params.name
    console.log(nameparam)
    await File.find()
    .then(result=>allfiles = result)
    .catch(err=>res.status(500).send(err))
    var resp=[]
    const l=allfiles.length
    for(let i=0;i<l;i++){
        if (allfiles[i].name.includes(nameparam) && allfiles.length!=0) {
            var x=allfiles[i]
            x.path=__dirname+x.path
            resp.push(x)
        }
    }
    // console.log(resp)
    res.render('sr',{resp:resp})
})  

app.get('/viewfile/:fname',(req,res)=>{
    res.sendFile(__dirname+`/Data/${req.params.fname}`)
})

app.get('/test',async (req,res)=>{
    new File({id:3,name:"test",path:"test"}).save()
    .then(resp=>console.log(resp))
    .catch(err=>console.log(err))
})


app.listen(3000,()=>console.log(`port ${3000}`))
const express=require('express')
const bodyparser=require('body-parser')
const cookieParser=require('cookie-parser')
const app=express()
const fileupload=require('express-fileupload')
const mongoose=require('mongoose')
const File=require('./models/cli')
const {getseq,savefile} = require('./functions')
const cli = require('./routes/cli')
const web = require('./routes/web')
const dev =require('./routes/dev')
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect("mongodb+srv://urlshortner:urlshortner@node.bczjx.mongodb.net/CLI?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology:true})
.then((result)=>{console.log("connected");app.listen(process.env.PORT||3000)})
.catch((err)=>console.log(err))
app.use(cookieParser())
app.set('views','templates')
app.set('view engine','ejs')
app.use(express.static('public'))
app.use(bodyparser.json())

app.use(bodyparser.urlencoded({extended:true}))
app.use(fileupload())
app.use('/cli/',cli)
app.use('/web/',web)
app.use('/dev/',dev)
app.get('/',(req,res)=>{

    res.redirect('/web/');
})


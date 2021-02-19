#!/usr/bin/env node
const { default: axios } = require("axios");
const yargs = require("yargs");
const fs=require('fs') 
const FormData= require('form-data');
var token = fs.readFileSync('./token.json')
token=JSON.parse(token)
var ip="http://localhost:3000/cli/"
const options = yargs
.usage("Usage: -u <path to file>")
.usage("Usage: -gi <get file by id>")
.usage("Usage: -f <find all files >")


.option("up", {alias:"upload", describe: "Path to file", type: "string", demandOption: false })
.option("g", { alias:"Get",describe: "get file by id", type: "string", demandOption: false })
.option("f", { alias:"Find",describe: "find file", type: "string", demandOption: false })
.option("show", { alias:"show",describe: "find file", type: true, demandOption: false })
.option("t", { alias:"test",describe: "find file", type: "string", demandOption: false })
.option("l", { alias:"login",describe: "login", type: true, demandOption: false })
.option("c", { alias:"create",describe: "create account", type: true, demandOption: false })
.option("u", { alias:"username",describe: "username", type: "string", demandOption: false })
.option("p", { alias:"password",describe: "password", type: "string", demandOption: false })
.argv;

if (token.authtoken) {
    if (options.Get) {
    
    const a=Number(options.Get)
    if(isNaN(a)){
        console.log("Enter a correct id")
        console.log("It better be a number :)")
    }
    else{
        const headers={
            authtoken:token.authtoken
        }
        axios.get(`http://localhost:3000/cli/getfile/${a}`,{headers})
        .then(resp=>{
            const buffer=new Buffer.from(resp.data.file_to_send)
            const file_name=resp.data.name
            fs.writeFileSync(`./Downloads/${file_name}`,String(buffer))
        
        
        
        })
        .catch(Err=>console.log(Err))
    }
}

if (options.show) {
    const headers={
        authtoken:token.authtoken
    }
    axios.get(`http://localhost:3000/cli/showall/${token.authtoken}`)
    .then(resp=>{
        const filedata=resp.data
        const length=resp.data.length
        console.log("\nID.\tName\tPermission\n")
        // let i
        for ( i = 0; i < length; i++) {
            const element = filedata[i]
            console.log(`${element.id}\t${element.name}\t${element.permission}`)
        }
    })
    .catch(err=>console.log(err))

}
if (options.upload) {
    const form = new FormData();
    form.append('file', fs.readFileSync(__dirname+options.upload));

    function getnamefrompath(path){
        const name= path.split('/')
          return name[name.length-1]
      }
const config = {
  headers: {
    ...form.getHeaders(),
    authtoken:token.authtoken,
    name: getnamefrompath(options.upload)
  },
};

axios.post('http://localhost:3000/cli/upload/', form.getBuffer(), config)
.then(res=>console.log(res.data))
.catch(err=>console.log((err)))
}

if(options.test){
    
    axios.get('http://localhost:3000/cli/test',headers)
    .then(res=>console.log(res.data))
    .catch(err=>console.log(err))
    
}
if ((options.login || options.create) && options.username && options.password){
    console.log("already logged in macha")
}
}

else{
    

 if (options.login && options.username && options.password) {
     axios.post('http://localhost:3000/cli/login/',{name:options.username,password:options.password})
     .then(res=>{
        if(res.status===200)
        {
            console.log("Credentials valid, Logged in")
            fs.writeFileSync('./token.json',JSON.stringify({authtoken:res.data}))
        }else{ 
            console.log("incorrect password")
        }
    })
     .catch(err=>console.log(err.response.data))   
    }
    else if (options.create && options.username && options.password) {
        axios.post('http://localhost:3000/cli/registeruser/',{name:options.username,password:options.password})
        .then(res=>{
           res.status===200 ? fs.writeFileSync('./token.json',JSON.stringify({authtoken:res.data})) : console.log("username is taken.")
            // console.log(res)
    })
        .catch(err=>console.log(err.response.data))   
       }
    else{
        console.log("You Are not authenticated.Try logging in")
        console.log("etzy -c -u <username> -p <password>  --- To create New Account")
        console.log("etzy -l -u <username> -p <password>  --- To log in into existing Account")
       }
    }

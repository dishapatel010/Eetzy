const File=require('./models/cli')
let leng;
const getseq= async ()=>{
   await File.find()
    .then( async (res)=> { leng=await res.length ;})
    .catch(err => console.log(err))
    return leng
}

module.exports={getseq}
const File=require('./models/cli')
const getseq= async ()=>{
    let leng;
   await File.find()
    .then( async (res)=> { leng=await res.length ;})
    .catch(err => console.log(err))
    return leng
}

module.exports={getseq}
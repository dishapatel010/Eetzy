const d=document
const btn = document.getElementsByTagName('button')[0]
const infodiv=document.getElementById('infodiv')
const p=d.getElementsByTagName('input')[1]
const p0=d.getElementsByTagName('input')[0]
const p1=d.getElementsByTagName('input')[2]

async function postdata(url,data){
    const response=await fetch(url,{
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
          },
        body:JSON.stringify(data)
    });
    return response.json()

}


btn.addEventListener('click',function(e){
    e.preventDefault()
    if(p1.value!==p.value){
        infodiv.innerText="Passwords didnt match"
        p1.value=""
        p.value=""
    }
    else{

        postdata('/web/createacc',{username:p0.value,password:p1.value})
        .then(res=>{
            alert(res.msg)
            p1.value=""
            p.value=""

        })
        .catch(err=>console.log(err))
    }
    
})


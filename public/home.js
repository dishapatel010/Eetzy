async function getdata(url,data){
    const response=await fetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
          },
        body:JSON.stringify(data)
    });
    return response.json()
}
async function postdata(url,data){
    const response=await fetch(url,{
        method:'POST',
        body:data
    });
    return response.json()
    
}
function loaded(){
    getdata('/web/api/getfiles')
    .then(res=>appendfiles(res))
    .catch(err=>console.log(err))
}

function appendfiles(arr){
    const ol=document.getElementsByTagName('ol')[0]

    for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        const li=document.createElement('li')
        const new_element=document.createElement('a')
        new_element.href=`/web/api/downloadfile/${element.name}`
        new_element.innerHTML=element.name
        li.appendChild(new_element)
        ol.appendChild(li)
    }
}

const body=document.getElementsByTagName('body')[0]
const up_btn=document.getElementById('uploadbtn')


up_btn.addEventListener('click',function(e){
    e.preventDefault()
    if (document.getElementById('file').value==="") {
        alert('select file')
    } else {
    const up_files=document.getElementById('file').files[0]
    const formdata=new FormData()
    formdata.append('file',up_files)
    postdata('/web/api/uploadfiles/',formdata)
    .then(res=>{
        alert(res.msg)
        document.getElementById('file').value=""
        window.location=window.location
    })
    .catch(err=>console.log(err))
}
})
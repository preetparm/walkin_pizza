const ev =document.getElementById('addInventoryForm').addEventListener('submit',function(event){

event.preventDefault()
const data= new FormData(this)



const qty= data.get("qty")
const id= JSON.parse(data.get("item"))
id.Qty=qty;
console.log(id);

 fetch('/addInventory',{
    
   method: "post",
   headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(id),  // Send data as JSON
}).then(res=>res.json())
.then(data=>{
    
    
    if(data.success){
        alert("inventory added")
    }
    else{
        alert("failed to transact")
    }
}).catch(err=>{
    console.log(err);
    

})

})
// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
   // Select the message display element and submit button
   const msg = document.getElementById("msg");
   const btn = document.getElementById("submitBtn");

   // Collect all the input elements to be validated
   const allEvent = [
       document.getElementById("name"),
       document.getElementById("released_year"),
       document.getElementById("githut_rank"),
       document.getElementById("pypl_rank"),
       document.getElementById("tiobe_rank")
   ];

   console.log(allEvent); // For debugging: log the input elements
const chekcField=()=>{
  
          // Check if any of the input fields are empty
       const ifError = allEvent.some((e) => !e.value.trim()) ||  /\d/.test(allEvent[0].value)
       console.log(ifError); 
       
       btn.disabled = ifError;
       console.log("name value"+allEvent[0].value);
       

       if (ifError ) {
          
           msg.textContent = "Some fields are empty"; // Display error message
       } else {
           msg.textContent = ""; // Clear the message if no errors
       }
   }
   chekcField()
allEvent.forEach(ev=>ev.addEventListener('input',chekcField))


});

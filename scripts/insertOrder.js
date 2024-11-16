// Handle form submission with Fetch API
document.getElementById('pizza-order-form').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent form from submitting traditionally

    const formData = new FormData(this);  // Gather form data
    

    // Convert form data into an object
    const orderData = {};
    formData.forEach((value, key) => {
      if (orderData[key]) {
        // If it's an array (for toppings)
        orderData[key].push(value);
      } else {
        orderData[key] = [value];
      }
    });
    console.log(orderData);
    


    // Send data using Fetch API
    fetch('/submit-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),  // Send data as JSON
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Order placed successfully!');
      } else {
        alert('Failed to place order.');
      }
    })
    .catch(error => {
      alert('An error occurred: ' + error);
    });
  });
  

  document.getElementById("pizza-order-form").addEventListener("change", function(event) {
    const selectedElements = this.querySelectorAll('[data-price]:checked, [data-price]:checked:enabled'); // Select only checked elements with data-price
    const selectedPrices = [];

    selectedElements.forEach(element => {
        // Get the 'data-price' attribute value for the selected element
        const price = element.getAttribute('data-price');
        const name = element.name;  // Get the name of the element (like pizza_size, dough_type, etc.)

        // Store the name and price in the array
        selectedPrices.push({ name, price });
    });
    let price=0;
    const showTotal=document.getElementById("total-price")

selectedPrices.forEach(selectedPrice=>{

  price+=parseFloat( selectedPrice.price)
  
 })

showTotal.innerHTML= `Total $: ${price.toFixed(2,10)}`

    console.log((price));
});



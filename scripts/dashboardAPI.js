let chart; // Declare the chart variable globally
let isIntervalSet = false; // To prevent multiple intervals
let passData=[];
function Dashboard() {
 
  function Fetch() {
    fetch('/DashboardAPI', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        passData=data.data.data
        console.log(data.data.data);

        const ctx = document.getElementById('Total_topping_chart').getContext('2d');

        // Get labels and data for topping and dough
        const topping_label = data.data && data.data.data.remainingQty.map(item => item.item_name);
        const dough_label = data.data && data.data.data.dough.map(item => item.Dough_name); // Corrected this line
        const topping_data = data.data.data.remainingQty.map(item => item.remaining_inventory);
        const dough_data = data.data.data.dough.map(item => item.total_weight);
console.log(topping_data);
const inv = document.querySelector(".low_inv"); // Select the <p> with class "low_inv"
const warningSection = document.getElementById("warning-section"); // Select the warning section

let lowInventoryItems = ""; // Initialize a string to accumulate item names

data.data.data.remainingQty
  .filter(qty => qty.remaining_inventory < 500)  // Filter items with inventory < 6000
  .forEach(qty => {
    lowInventoryItems += `${qty.item_name} (Remaining: ${qty.remaining_inventory})<br>`;  // Append the item name and remaining inventory
  });

// Check if there are any low inventory items
if (lowInventoryItems) {
  inv.innerHTML = lowInventoryItems;  // Display all low inventory items in the <p> with class "low_inv"
  warningSection.classList.remove("hidden"); // Make sure the warning section is visible
} else {
  inv.innerHTML = "No items are below the threshold.";  // If no items are found, display a different message
  warningSection.classList.add("hidden"); // Hide the warning section
}




        if (chart) {
          console.log("chart is here");
          chart.data.labels = topping_label; // Combine labels
          chart.data.datasets[0].data = topping_data; // Combine data for chart
          chart.update(); // Update the chart with new data
        } else {
          // Create the chart if it does not already exist
          console.log("chart not found");
          chart = new Chart(ctx, {
            type: 'bar', // Change this to your preferred chart type
            data: {
              labels: topping_label, // Combine labels for topping and dough
              datasets: [
                {
                  label: 'Topping Weights',
                  data: topping_data,
                  backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                  ],
                  borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(153, 102, 255, 1)',
                  ],
                  borderWidth: 1,
                },
                
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
            },
          });
        }

        
         // Fetch the data for the current year directly
          const yearData = data.data.data.orderBysize.filter(order => order.period === 'Current year');
       console.log(yearData);
       (yearData)
          // Get total orders for each size in the current year
          const smallOrders = yearData.find(order => order.size_name === 'Small')?.total_order || 0;
          const mediumOrders = yearData.find(order => order.size_name === 'Medium')?.total_order || 0;
          const largeOrders = yearData.find(order => order.size_name === 'Large')?.total_order || 0;
          

// Update the text in the cards
document.getElementById('small-orders').textContent = `Total Orders: ${smallOrders}`;
document.getElementById('medium-orders').textContent = `Total Orders: ${mediumOrders}`;
document.getElementById('large-orders').textContent = `Total Orders: ${largeOrders}`;


document.getElementById("this_year").innerHTML=data.data.data.total_order[3].total_orders
document.getElementById("this_month").innerHTML=data.data.data.total_order[2].total_orders
document.getElementById("this_week").innerHTML=data.data.data.total_order[1].total_orders
document.getElementById("today").innerHTML=data.data.data.total_order[0].total_orders




      })




      .catch(err => {
        console.log("Can't fetch data:", err);
      });




  }




  // Fetch data immediately, then set an interval to update every 5 seconds if not already set
  Fetch();
  if (!isIntervalSet) {
    setInterval(Fetch, 5000);
    isIntervalSet = true; // Prevents additional intervals
  }
}


window.onload = Dashboard;

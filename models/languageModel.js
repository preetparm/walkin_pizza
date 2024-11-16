const db= require("../services/db");
const bcrypt = require('bcryptjs');

 
 async function Getalllanguages(params) {
  const connection = await db.getConnection(); 
    const query = `
  SELECT size_name AS name, price AS price, 'pizza_size' AS type, id FROM pizza_sizes
  UNION ALL
  SELECT topping_name AS name, price AS price, 'topping' AS type, id FROM toppings
  UNION ALL
  SELECT dough_name AS name, price AS price, 'dough' AS type, id FROM dough_types;
`;

    const rows=await db.query(connection,query)
    return rows
    
}
// insertion order
async function insertOrder(insertOrder) {
    const con = await db.getConnection(); // Using the correct db connection
    try {
        // Start the transaction
        await con.beginTransaction();

        const { name, phone, email, address } = insertOrder;
        const sql = 'INSERT INTO customers (name, phone, email, address) VALUES (?, ?, ?, ?)';
        const result = await db.query(con, sql, [name, phone, email, address]); // Using con for transaction

        // Get the latest customer ID after insertion
        const get_latest_cust = result.insertId;

        const { pizza_size, dough_type, toppings } = insertOrder;
        const sizeID=parseInt(pizza_size,10)
        const doughID=parseInt(dough_type,10)
        const toppingID=parseInt(toppings,10)
        //const parsedSize = parseInt(size[0], 10);

        const sql2 = 'INSERT INTO pizza_orders (size_id, dough_id, customer_id) VALUES (?, ?, ?)';
        const result2 = await db.query(con, sql2, [sizeID, doughID, get_latest_cust]);

        // Get the latest order ID after inserting pizza order
        const get_latest_orderID = result2.insertId;

        // Insert toppings using the order ID
        const sql3 = 'INSERT INTO order_toppings (order_id, topping_id) VALUES (?, ?)'; // Correct table and query
        const result3 = toppings.map(topping => db.query(con, sql3, [get_latest_orderID, parseInt(topping,10)])); // Collect promises
        console.log();
        
        await Promise.all(result3); // Wait for all toppings to be inserted

        // Commit the transaction if everything is successful
        await con.commit();
        console.log("Order and toppings inserted successfully!");

        // Return the customer ID and the order ID
        return 
    } catch (error) {
        // Roll back if there's an error
        await con.rollback();
        console.error("Transaction failed, rolling back:", error);
        throw error;
    } finally {
        await con.end(); // Close the connection after all operations
    }
}

//insertion end


async function signUp(SignupData) {
  const connection = await db.getConnection();

    const { name, email, password } = SignupData;

    const insertQuery = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
  
    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hashing the password
const values=[name,email,hashedPassword]
      // Use the connection to execute the insert query
      const result = await db.query(connection,insertQuery, values);
  
      // Log the result of the insert operation
      console.log('User inserted successfully with ID:', result.insertId);
  
    } catch (error) {
      console.error('Database error:', error);
    } 
  }
  async function loginPost(LoginpostData) {
    const { email,password } = LoginpostData;
    
    const connection = await db.getConnection();
    try {
        // Fetch the user by email
        const query = 'SELECT * FROM users WHERE email = ?';
        const user = await db.query(connection,query, [email]);
        console.log(user);
    
        if (user.length === 0) {
          // If no user is found, return an error
          console.log('User not found');
          return;
        }
    
        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user[0].password);
    
        if (isMatch) {
          // If the passwords match, login is successful
          console.log('Login successful',isMatch);
          return [email,isMatch];
          // You can return user data or generate a session token, etc.
        } else {
          // If the passwords don't match
          console.log('Invalid password');
        }
      } catch (error) {
        console.error('Error during login:', error);
      }
    }
    async function addInventory(addinv) {
      const { id,Qty,name  } = addinv;
      
      const connection = await db.getConnection();
      try {
        if(name!== "Thin Crust" & name!== "Thik Crust" ){
          // Fetch the user by email
          const query = 'insert into  inventory (topping_id,quantity_grams) values (?,?)';
           const user = await db.query(connection,query, [id,Qty]);
           console.log("if triggred",user.insertId);
           connection.commit()
           return({ success: true, message: "Order added successfully" });
        }
        else if(name=== "Thin Crust" || name=== "Thik Crust"  ) {
              const query2 = 'insert into  inventory_dough (dough_type_id,Quantity) values (?,?)';
               const user2 = await db.query(connection,query2, [id,Qty]);
               console.log("else triggred",user2.insertId);
               connection.commit()
               return({ success: true, message: "Order added successfully" });
        }
         
          
          
          console.log();
      
           
          connection.end()
        } catch (error) {
          console.error('error in adding inventory:', error);
        }

      }
      
// code for dash board operation 
      async function Dashboard() {
        
        
        const connection = await db.getConnection();
        try {
          // fetch  total qty used  of the  all topings
                            const Total_topping = `SELECT 
                    toppings.topping_name AS topping_name,
                    SUM(topping_weights.weight) AS total_weight
                FROM 
                    pizza_orders 
                JOIN 
                    order_toppings ON pizza_orders.id = order_toppings.order_id
                JOIN 
                    toppings ON toppings.id = order_toppings.topping_id
                JOIN 
                    topping_weights ON topping_weights.topping_id = toppings.id
                GROUP BY 
                    toppings.topping_name;
                    `
                    const total_dough=`SELECT 
    dough_types.dough_name AS Dough_name,
    SUM(dough_weights.weight) AS total_weight
FROM 
    pizza_orders 
JOIN 
    dough_types ON pizza_orders.dough_id = dough_types.id
JOIN 
    dough_weights ON dough_weights.dough_id =dough_types.id

GROUP BY 
    dough_types.dough_name;
`
const total_order=`SELECT 'Current Day' AS period, COUNT(*) AS total_orders
FROM pizza_orders
WHERE DATE(created_at) = CURDATE()

UNION ALL

SELECT 'Current Week', COUNT(*)
FROM pizza_orders
WHERE WEEK(created_at, 1) = WEEK(CURDATE(), 1)
AND YEAR(created_at) = YEAR(CURDATE())

UNION ALL

SELECT 'Current Month', COUNT(*)
FROM pizza_orders
WHERE MONTH(created_at) = MONTH(CURDATE())
AND YEAR(created_at) = YEAR(CURDATE())
UNION ALL
SELECT 'current_Year', COUNT(*)
FROM pizza_orders
WHERE  YEAR(created_at) = YEAR(CURDATE());
`
const bySizes=`SELECT 'Today' as period, pizza_sizes.size_name, COUNT(*) as total_order

FROM pizza_orders
JOIN  pizza_sizes
on pizza_sizes.id=pizza_orders.size_id
WHERE DATE(created_at) = CURDATE()
GROUP BY pizza_sizes.size_name
UNION ALL

SELECT 'Current Week' as period, pizza_sizes.size_name, COUNT(*) as total_order
FROM pizza_orders
JOIN  pizza_sizes
on pizza_sizes.id=pizza_orders.size_id
WHERE WEEK(created_at, 1) = WEEK(CURDATE(), 1)
AND YEAR(created_at) = YEAR(CURDATE())
GROUP BY pizza_sizes.size_name
UNION ALL

SELECT 'Current Month' as period, pizza_sizes.size_name, COUNT(*) as total_order
FROM pizza_orders
JOIN  pizza_sizes
on pizza_sizes.id=pizza_orders.size_id
WHERE MONTH(created_at) = MONTH(CURDATE())
AND YEAR(created_at) = YEAR(CURDATE())
GROUP BY pizza_sizes.size_name
UNION ALL
SELECT 'Current year' as period, pizza_sizes.size_name, COUNT(*) as total_order
FROM pizza_orders
JOIN  pizza_sizes
on pizza_sizes.id=pizza_orders.size_id
WHERE  YEAR(created_at) = YEAR(CURDATE())
group by pizza_sizes.size_name
`        

const remainingQty=`

WITH 
-- Toppings calculation
toppings AS (
    SELECT 
        toppings.id,
        toppings.topping_name AS topping_name,
        SUM(topping_weights.weight) AS total_weight
    FROM 
        pizza_orders 
    JOIN 
        order_toppings ON pizza_orders.id = order_toppings.order_id
    JOIN 
        toppings ON toppings.id = order_toppings.topping_id
    JOIN 
        topping_weights ON topping_weights.topping_id = toppings.id
    GROUP BY 
        toppings.id, toppings.topping_name
),
InventToppings AS (
    SELECT 
        toppings.id AS topping_id,
        toppings.topping_name AS topping_name,
        SUM(inventory.quantity_grams) AS total_inventory
    FROM 
        inventory
    JOIN 
        toppings ON toppings.id = inventory.topping_id
    GROUP BY 
        toppings.id, toppings.topping_name
),
-- Dough calculation
dough AS (
    SELECT 
        dough_types.id,
        dough_types.dough_name,
        SUM(dough_weights.weight) AS consumes,
        SUM(inventory_dough.Quantity) AS total_inventory,
         (SUM(inventory_dough.Quantity)-SUM(dough_weights.weight) ) AS remaining_qty
    FROM 
        pizza_orders
    JOIN 
        dough_types ON pizza_orders.dough_id = dough_types.id
    JOIN 
        dough_weights ON dough_types.id = dough_weights.dough_id
    JOIN 
        inventory_dough ON inventory_dough.dough_type_id = dough_types.id
    GROUP BY 
        dough_types.id, dough_types.dough_name
)

-- Final selection combining both toppings and dough information
SELECT 
    'Topping' AS item_type,
    InventToppings.topping_name AS item_name,
    InventToppings.total_inventory,
    COALESCE(toppings.total_weight, 0) AS total_used,
    (InventToppings.total_inventory - COALESCE(toppings.total_weight, 0)) AS remaining_inventory
FROM 
    InventToppings
LEFT JOIN 
    toppings ON InventToppings.topping_id = toppings.id

UNION ALL

SELECT 
    'Dough' AS item_type,
    dough.dough_name AS item_name,
    dough.total_inventory,
    dough.consumes AS total_used,
    dough.remaining_qty AS remaining_inventory
FROM 
    dough;
`
 

             const data = await db.query(connection,Total_topping);
             const data2 = await db.query(connection,total_dough);
             const data3 = await db.query(connection,total_order);
             const data4 = await db.query(connection,bySizes);
             const data5 = await db.query(connection,remainingQty);
             console.log("got all topping with total weight");
            
             const dashboardData={
              topping:data,
              dough:data2,
              total_order:data3,
              orderBysize:data4,
              remainingQty:data5
              
             }
             connection.commit()
             return({ success: true, data: dashboardData });
          }
              
                  
             
           
          
          catch (error) {
            console.error('error in adding inventory:', error);
          }
          finally{
            connection.end()

          }
        }
  
        
        

      
    

    

module.exports={Getalllanguages,insertOrder, signUp,loginPost,addInventory,Dashboard}
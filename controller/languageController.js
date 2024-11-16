
const { useloginPost } = require("../middleware/userLogin")
const languageModel =require("../models/languageModel")

//const addLanguagesModel =require("../models/addLanguagesModel")



exports.index = async (req, res) => {
  
    try{
       const results=await languageModel.Getalllanguages()
       const organizedData = {
        pizza_sizes: results.filter(item => item.type === 'pizza_size'),
        toppings: results.filter(item => item.type === 'topping'),
        dough_types: results.filter(item => item.type === 'dough'),
        forEntry: results.filter(item=>item.type !=='pizza_size')
        
      };
      
      
       res.render('PizzaFronEnd',{ data:organizedData});
    }
    catch(err){
        console.log(err);
        
    }
}
//to show languages
    exports.ShowEntryForm =async (req, res) => {
       
        results =await languageModel.Getalllanguages()
        const organizedData = {
            forEntry:results.filter(item=>item.type !=='pizza_size')
        }
        
              res.render('addInventory',{data:organizedData}); 
    }
             
    //to add languages
    exports.insertOrder = async (req, res) => {
            
        const data=req.body
        console.log(data);
       if (data) 
        try{
           const langs=await languageModel.insertOrder(data)
           
           res.json({ success: true, message: "Order received" });
           
        }
    
        catch(err){
            console.log(err);
            
        }
    
    }

    exports.signUp = async (req, res,next) => {
        const signupdata=req.body;
        if (Object.values(signupdata).some(value => value === "")) {
            // This will be true if any field is empty
            console.log("One or more fields are empty.");
            return res.json({messgae:"cant signup without provieding all value"})
          } else {
            // All fields are filled
            console.log("All fields are filled.");
            try{
               const langs=await languageModel.signUp(signupdata)
                    res.status(201).redirect('/login');
                       
                    }
                
                    catch(err){
                        console.log(err);
                        
                    }
          }
         
    
    }
    exports.loginPost = async (req, res,next) => {
        const LoginpostData=req.body;
        if (Object.values(LoginpostData).some(value => value === "")) {
            // This will be true if any field is empty
            console.log("One or more fields are empty.");
            return res.json({messgae:"cant signup without provieding all value"})
          } else {
            try {
                const [email, isMatch] = await languageModel.loginPost(LoginpostData)
                if(isMatch){
                    useloginPost(req,res,email, isMatch)
                }
                console.log("got user in controller ");
                

            }
            catch (err){
                res.json(err)
            }


           

          }
   
   
    }

    exports.addInventory = async (req, res,next) => {
        const postinventory=req.body;
        if (Object.values(postinventory).some(value => value === "")) {
            // This will be true if any field is empty
            console.log("One or more fields are empty.");
            return res.json({messgae:"cant add empty inventory value"})
          } else {
            try {
                 const addedinvnentory= await languageModel.addInventory(postinventory)
                 res.json(addedinvnentory)
                }
                

          
            catch (err){
                res.json(err)
            }


           

          }
   
   
        }
//Dashboard 
        exports.Dashboard = async (req, res) => {
            
            
            try{
               const data=await languageModel.Dashboard()
               //console.log(data);
               
               res.render('Dashboard', {data:data});
               
            }
        
            catch(err){
                console.log(err);
                
            }
        
        }
        exports.DashboardAPI = async (req, res) => {
            
            
            try{
               const data=await languageModel.Dashboard()
               console.log("api trigred");
               
               res.json({data:data});
               
            }
        
            catch(err){
                console.log(err);
                
            }
        
        }
    
    
    
    
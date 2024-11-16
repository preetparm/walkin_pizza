const express=require('express')
const router=express.Router();
const languageController =require("../controller/languageController")



// router.get('/',languageRouter.index,(req,res)=>{
//     console.log("i am at router");
    
// })
router.get('/', languageController.index);
//router.post('/login',loginController )
//to display form page
router.post('/addInventory',languageController.addInventory)

router.get('/addInventory',languageController.ShowEntryForm);


router.get('/Dashboard',languageController.Dashboard);
router.get('/DashboardAPI',languageController.DashboardAPI);
//for adding new language
router.post('/login',languageController.loginPost)

router.post('/submit-order',languageController.insertOrder);
router.post('/signup',languageController.signUp)

 module.exports= router;
 
//const users = require("../users");
const Token=require("./jwtCreateToken")
const verifyToken = require("./jwtValidate");


const uselogin=(verifyToken,next)=>{
    //const token = req.query.token;
    //console.log(token);
       
    next()

}

const useloginPost =(req,res,email,isMatch)=>{
    
       
    if(isMatch){
        console.log("u are logged in aho");
        const {token}=Token(email)
        if(token){
            console.log("token obtained");
            
            res.cookie('token', token);
        }
       
        
        
return res.redirect('/')

    }
    else{
        return  res.redirect('/login')
    }
    

}

module.exports = { uselogin, useloginPost };
const jwt = require("jsonwebtoken")
let success_handling = require('../Status/success_handling');


module.exports = function (req,res,next){
    //console.log("auth-token",req.header("auth-token"),"\n\n")
   
    const token = req.header("auth_token");
    //console.log("Verify auth-token\n",token,"\n\n");
    if(!token){ 
        //res.send(error_handling("Token Invalid"))
        //console.log("Access Denied")
        return res.status(401).send("Access Denied")
    };
    try{
        const verifed = jwt.verify(token,process.env.ACCESS_TOKEN_KEY_RECEPTION)
        req.user = verifed
        //console.log("Reception Verifed");
        res.send(success_handling("reception"))
        next();
    }catch(err){
        //console.log("Invalid Token ACCESS_TOKEN_KEY_RECEPTION");
        //res.send(400).send("Invalid Token")
       // return res.status(400).send("Invalid Token")
        //res.sendStatus(400)
        try{
            const verifed = jwt.verify(token,process.env.ACCESS_TOKEN_KEY_ADMIN)
            req.user = verifed
            //console.log("Admin Verifed");
            res.send(success_handling("admin"))
            next();
        }catch(err){
            //console.log("Invalid Token ACCESS_TOKEN_KEY_ADMIN");
            //res.send(400).send("Invalid Token")
            return res.status(400).send("Invalid Token")
            //res.sendStatus(400)
            
        }
    }
};




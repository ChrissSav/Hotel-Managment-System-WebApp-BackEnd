const jwt = require("jsonwebtoken")


module.exports = function (req,res,next){
    //console.log("auth-token",req.header("auth-token"),"\n\n")
   
    const token = req.header("auth_token");
    //console.log("Verify auth-token\n",token,"\n\n");
    if(!token){ 
        //res.send(error_handling("Token Invalid"))
        console.log("Access Denied")
        return res.status(401).send("Access Denied")
    };
    try{
        const verifed = jwt.verify(token,process.env.ACCESS_TOKEN_KEY_RECEPTION)
        req.user = verifed
        next();
    }catch(err){
        console.log("Invalid Token");
        //res.send(400).send("Invalid Token")
        return res.status(400).send("Invalid Token")
        //res.sendStatus(400)
    }
};




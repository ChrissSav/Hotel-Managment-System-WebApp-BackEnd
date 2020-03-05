const jwt = require("jsonwebtoken")
const TOKEN_KEY ="UOM"


module.exports = function(req,res,next){
    const token = req.header("auth-token");
    if(!token) res.status(401).send("Acces Denied");
    try{
        const verifed = jwt.verify(token,TOKEN_KEY)
        req.user= verifed
        next();
    }catch(err){
        res.status(400).send("Token Invalid");
    }
};
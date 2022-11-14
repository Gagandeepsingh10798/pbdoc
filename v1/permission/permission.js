let user = require("../../data-models/user")
let Apipermission = require("../../data-models/Apipermission");
 async function checkpermission(req,res,next){
  const userEmail = req.body.email;
  
    if (userEmail) {
      req.user =  await user.findOne({ email:userEmail}).lean();
    }
    const Apipath = req.originalUrl;
   

    if(req.user === null)
    {
        res.send("You Need to Sign Up");
        return ;
    }
    const type = req.user.type;
   const x = await Apipermission.findOne({userType:type,permissions: Apipath}).lean();
    if(x== null)
    {
      res.send("Access Denied");
        return ; 
    }
    console.log("Access Approved");
   next();
}

 
  module.exports = {
    checkpermission
  };
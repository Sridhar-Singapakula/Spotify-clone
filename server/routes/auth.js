const router=require("express").Router();
const bcrypt=require("bcrypt");
const { validate, User } = require("../models/user");


router.post("/",async (req,res)=>{
    try {
        const user= await User.findOne({email:req.body.email})
        if(!user){
            
            return res.status(403).send({message:"User does not exists"});
        }
        const validPassword= await bcrypt.compare(req.body.password,user.password);
        if(!validPassword){
            return res.status(400).send("Invalid Credentials");
        }
        const token=user.generateAuthToken();
        res.status(200).send({data:token,message:"Successful login"});

    } catch (error) {
       
        res.status(500).send(error);
    }
});

module.exports=router
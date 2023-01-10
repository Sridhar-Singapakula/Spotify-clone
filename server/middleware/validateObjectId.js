const mongoose = require("mongoose");

module.exports =(req,res,next)=>{
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        res.status(400).send({message:"Invalid Id"});
    }
    next();
}
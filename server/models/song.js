const mongoose=require("mongoose");
const Joi =require("joi");

const songSchema= new mongoose.Schema({
    
    name:{type:String,required:true},
    artist:{type:String,required:true},
    song:{type:String,required:true},
    img:{type:String,required:true},
    duration:{type:Number,required:true}
});

const Song =mongoose.model("song",songSchema);

const validate=(data)=>{
    const schema=Joi.object({
        name:Joi.string().required().label("Name"),
        artist:Joi.string().required().label("artist"),
        song:Joi.string().required().label("song"),
        img:Joi.string().required(),
        duration:Joi.number().required().label("duration"),
    });

    return schema.validate(data);
};

module.exports= {Song,validate}
const router=require("express").Router();
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const validObjectId = require("../middleware/validateObjectId");
const {validate,Song}=require("../models/song");
const { User } = require("../models/user");

//create song
router.post("/",admin, async(req,res)=>{
    const {error} = validate(req.body);
    if(error){
        return res.status(400).send({message:error.details[0].message});
    }
    const createSong=await new Song(req.body).save();
    res.status(200).send({data:createSong,message:"successfully created the song"});
})

//get all songs
router.get("/",async(req,res)=>{
    const allSongs=await Song.find();
    res.status(200).send({data:allSongs, message:"All songs displayed"});
})

//update the song
router.put("/:id",[validObjectId,admin],async(req,res)=>{
    const updatedSong= await Song.findByIdAndUpdate(req.params.id,req.body,{new:true});
    res.status(200).send({data:updatedSong,message:"Song updated"});
});

//like song
router.put("/like/:id",[validObjectId,auth],async(req,res)=>{
    let resMessage="";
    const song =await Song.findById(req.params.id)
    if(!song){
        return res.status(400).send({message:"Song does not exits"})
    }
    const user= await User.findById(req.user._id);
    const index=await user.likedSongs.indexOf(song._id);
    if(index===-1){
        user.likedSongs.push(song._id);
        resMessage="Added to liked songs"
    }
    else{
         user.likedSongs.splice(index,1);
         resMessage="removed from liked songs"
    }

    await user.save();

    res.status(200).send({message:resMessage});
})

//get all liked songs

router.get("/like",auth,async(req,res)=>{
    const user=await User.findById(req.user._id);
    const songs= await Song.find({user:req.user});
   
    res.status(200).send({data:songs});
})

module.exports=router
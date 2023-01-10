const router=require("express").Router();
const Joi=require("joi");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const { validate, playlist } = require("../models/playlist");
const { Song } = require("../models/song");
const { User } = require("../models/user");





//create Playlist
router.post("/",auth,async(req,res)=>{
        const {error}=validate(req.body)
        if(error){
            return res.status(400).send({message:error.details[0].message});
         }
        const user= await User.findById(req.user._id);
        const playList= await playlist({...req.body,user:user._id}).save();
        user.playlists.push(playList._id);
        await user.save()
        res.status(200).send({data:playList , message:"Playlist created"});
})

//edit the playlist
router.put("/edit/:id",[validateObjectId,auth],async(req,res)=>{
    const schema=Joi.object({
        name:Joi.string().required(),
        desc:Joi.string().allow(""),
        img:Joi.string().allow(""),
    });
    const {error}= schema.validate(req.body);
    if(error){
        return res.status(400).send({message:error.details[0].message});
    }
    const user=await User.findById(req.user._id);
    const playList=await playlist.findById(req.params.id);
    if(!playList){
        return res.status(400).send({message:"Play does not exists"})
    }

    if(!user._id.equals(playList.user)){
        return res.status(400).send({message:"User do not have access"});
    }
    playList.name=req.body.name
    playList.desc=req.body.desc
    playList.img=req.body.img
    await playList.save()
    res.status(200).send({message:"Successfully edited the playlist"});
});

//add song to playlist
router.put("/add-song",auth,async(req,res)=>{
    const schema=Joi.object({
        playListId:Joi.string().required(),
        songId:Joi.string().required()
    });
    const {error}=schema.validate(req.body);
    if(error){
        return res.status(400).send({message:error.details[0].message});
    }
    const user=await User.findById(req.user._id);
    const playList=await playlist.findById(req.body.playListId);
    if(!playList){
        return res.status(400).send({message:"Play does not exists"})
    }

    if(!user._id.equals(playList.user)){
        return res.status(400).send({message:"User do not have access"});
    }

    if(playList.songs.indexOf(req.body.songId)===-1){
        playList.songs.push(req.body.songId);
    }
    await playList.save()
    res.status(200).send({data:playList,message:"Added the song"});
})

//remove song
router.put("/re-song",auth,async(req,res)=>{
    const schema=Joi.object({
        playListId:Joi.string().required(),
        songId:Joi.string().required()
    });
    const {error}=schema.validate(req.body);
    if(error){
        return res.status(400).send({message:error.details[0].message});
    }
    const user=await User.findById(req.user._id);
    const playList=await playlist.findById(req.body.playListId);
    if(!playList){
        return res.status(400).send({message:"Play does not exists"})
    }

    if(!user._id.equals(playList.user)){
        return res.status(400).send({message:"User do not have access"});
    }
    const index=await playList.songs.indexOf(req.body.songId);
    playList.songs.splice(index,1);

    await playList.save()
    res.status(200).send({data:playList,message:"Removed the song"});
});

//user playlists
router.get("/favorite",auth,async(req,res)=>{
    
    const user= await User.findById(req.user._id);
   
    const playLists=await playlist.find({user:req.user});
    res.status(200).send({data:playLists});
})

//get random playlist
router.get("/random", auth, async (req, res) => {
	const playlists = await playlist.aggregate([{ $sample: { size: 10 } }]);
	res.status(200).send({ data: playlists });
});

//get playlist by id
router.get("/:id", auth, async (req, res) => {
    
	const playList = await playlist.findById(req.params.id);
    
	if (!playList) return res.status(404).send("not found");

	const songs = await Song.find({ _id: playList.songs });
	res.status(200).send({ data: { playList, songs } });
});

//get all playlist
router.get("/", auth, async (req, res) => {
	const playlists = await playlist.find();
	res.status(200).send({ data: playlists });
});

//delete playlist by Id
router.delete("/:id",[validateObjectId,auth],async(req,res)=>{
    const user= await User.findById(req.user._id);
    const playList=await playlist.findById(req.params.id);
    if (!user._id.equals(playList.user))
		return res
			.status(403)
			.send({ message: "User don't have access to delete!" });
    const index= user.playlists.indexOf(playList);
     user.playlists.splice(index,1);
    await user.save();
    await playList.remove();
    res.status(200).send({message:"Removed from library"})
});

module.exports=router
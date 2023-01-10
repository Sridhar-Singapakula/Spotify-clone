const router = require("express").Router();
const bcrypt = require("bcrypt");
const validObjectId = require("../middleware/validateObjectId");
const { validate, User } = require("../models/user");
const admin=require("../middleware/admin")
const auth=require("../middleware/auth")


router.post("/", async (req, res) => {
	console.log('hello')
  const { error } = validate(req.body);
	if (error) return res.status(400).send({ message: error.details[0].message });

	const user = await User.findOne({ email: req.body.email });
	if (user)
		return res
			.status(403)
			.send({ message: "User with given email already Exist!" });

	const salt = await bcrypt.genSalt(10);
	const hashPassword = await bcrypt.hash(req.body.password, salt);
	let newUser = await new User({
		...req.body,
		password: hashPassword,
	}).save();

	newUser.password = undefined;
	newUser.__v = undefined;
	res
		.status(200)
		.send({ data: newUser, message: "Account created successfully" });
});

//get all users
router.get("/",admin,async(req,res)=>{
	const users=await User.find().select("-password-__v");
	res.status(200).send({data:users});
});

//get user by Id
router.get("/:id",[validObjectId,auth],async(req,res)=>{
	const user= await User.findById(req.params.id).select("-password-__v");
	res.status(200).send({data:user});
})

//update user by Id
router.put("/:id",[validObjectId,auth],async(req,res)=>{
	const updatedUser= await User.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true}).select("-password-__v");
	res.status(200).send({data:updatedUser,message:"User updated successfully"});
})

//delete user by Id
router.delete("/:id",[validObjectId,admin],async(req,res)=>{
	await User.findByIdAndDelete(req.params.id);
	res.status(200).send({message:"Successfully deleted the user"})
})

module.exports = router;

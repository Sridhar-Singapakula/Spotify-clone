
const express=require("express");
const dotenv=require("dotenv");
const cors =require("cors");
const Connection=require("./db");
const userRoutes=require("./routes/user")
const authRoutes=require("./routes/auth")
const songRoutes=require("./routes/songs")
const playListRoutes=require("./routes/playlists")
const searchRoutes=require("./routes/search")

dotenv.config();
Connection();

const app=express();
app.use(express.json());
app.use(cors());
//Routes
app.use("/api/users",userRoutes);
app.use("/api/login",authRoutes);
app.use("/api/songs",songRoutes);
app.use("/api/playlists",playListRoutes);
app.use("/api/",searchRoutes)
//listening
const port = process.env.PORT || 8080;
app.listen(port,()=>{
    console.log(`Listening to ${port}..`);
})

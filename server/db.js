const mongoose = require("mongoose");

module.exports = () => {
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  try {
      mongoose.connect(process.env.DB);
       console.log("Database connected")
   }
 catch (error) {
    console.log(error);
    console.log("Database not connected")
}
}; 

const mongoose = require("mongoose");

// const DB_URI = "mongodb://localhost:27017/testing_gadgethub";
// const DB_URI = "mongodb://127.0.0.1:27017/testing_gadgethub"
const DB_URI = "mongodb+srv://dinesh:dinesh123@dinesh.tfbmsg5.mongodb.net/testing_gadgethub?retryWrites=true&w=majority"

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    process.exit(1); // Exit the process with a failure status
  }
};

module.exports = connectDB;



// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// dotenv.config();
//    async function connectdb(){ 
//     await mongoose.connect(process.env.uri, {
//     useNewUrlParser:true,
//     useUnifiedTopology:true,
// }).then(()=>{
//     console.log("Connected to MongoDB");
// }).catch((e)=> {
//     console.log(e);
// })
// }
// module.exports={connectdb};
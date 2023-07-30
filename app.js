const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db")
const app = express();
require('dotenv').config();
const subCategoryRouter = require("./routes/admin/subCategoryRouter");

// app.use("/feed", subCategoryRouter);
// const validateRegistration = require("./middlewares/validateRegistration");

app.use(express.urlencoded({ extended: false }));
const writeErrorToFile = (errorMessage) => {
  const fileName = 'error.log';
  const currentTime = new Date().toISOString();

  // Create the error message with timestamp
  const errorLog = `${currentTime}: ${errorMessage}\n`;

  // Write the error message to the file
  fs.appendFile(fileName, errorLog, (err) => {
    if (err) {33
      console.error('Error writing to file:', err);
    }
  });
};

// Middleware
app.use(express.json());

// Connect to the database
// mongoose.connect("mongodb://localhost:27017/testing_gadgethub", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// Include routes
app.route("/").get((req, res) => res.json("You are connected to Server."));
app.use("/admin/categories", require("./routes/admin/categoryRouter"));
app.use("/admin/subcategories", subCategoryRouter);
app.use("/admin/products", require("./routes/admin/productRouter"));
app.use("/admin/users", require("./routes/admin/userRouter"));
// app.use("/", require("./routes/public/mainRoutes"));

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// connectDB().then(() => {
//   app.listen(process.env.port, () => {
//     console.log("listening for requests");
//   });
// });
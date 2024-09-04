const mongoose = require("mongoose"); //import module mongoose

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      //connect mongoDB with mongoose
    //   useNewParser: true, // Use the new URL parser => unsupported for node 4.x++
    //   useUnifiedTopology: true, // Use the new Server Discover and Monitoring engine  => unsupported for node 4.x++
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;

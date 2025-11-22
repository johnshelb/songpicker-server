//CURRENTLY DEPLOYED ON RENDER

const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

///////
///////
app("/",(req,res)=>{
  console.log("hitting that route!")
})
//////////
///////////

// Mount the record routes under /record
app.use("/record", require("./routes/record"));

// Database connection
const dbo = require("./db/conn");

async function startServer() {
  try {
    await dbo.connectToServer(); // Wait until DB is connected
    console.log(`Database connected successfully.`);

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error("Error starting server:", err);
    process.exit(1); // Exit if DB connection fails
  }
}

startServer();

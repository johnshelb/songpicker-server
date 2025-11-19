// //CURRENTLY DEPLOYED ON RENDER
// const express = require("express");
// const app = express();
// const cors = require("cors");
// require("dotenv").config({ path: "./config.env" });
// const port = process.env.PORT || 5000;
// app.use(cors());
// app.use(express.json());
// // app.use(require("./routes/record"));
// app.use("/record", require("./routes/record"));

// // get driver connection
// const dbo = require("./db/conn");

// async function startServer() {
//   try {
//     await dbo.connectToServer(); // Wait until the database is connected
//     console.log(`Server is running on port: ${port}`);
//     app.listen(port); // Only start the server after DB connection is successful
//   } catch (err) {
//     console.error("Error starting server:", err);
//     process.exit(1); // Exit the process if DB connection fails
//   }
// }

// startServer();

// CURRENTLY DEPLOYED ON RENDER
const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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



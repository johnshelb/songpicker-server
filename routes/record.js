// const express = require("express");
// // recordRoutes is an instance of the express router.
// // We use it to define our routes.
// // The router will be added as a middleware and will take control of requests starting with path /record.
// const recordRoutes = express.Router();
 
// // This will help us connect to the database
// const dbo = require("../db/conn");

// // This helps convert the id from string to ObjectId for the _id.
// const ObjectId = require("mongodb").ObjectId;


// // This section will help you get a list of all the records.
// // recordRoutes.get("/", function (req, res) {
// // //recordRoutes.route("/record").get(function (req, res) {
// //    console.log("GET /record called", req.query);

// //   const { owner } = req.query;
// // let db_connect = dbo.getDb();
// // db_connect
// //    .collection("Songs")
// //    .find({owner})
// //    .toArray(function (err, result) {
// //      if (err) throw err;
// //      console.log("DB query result:", result); // <--- add this

// //      res.json(result);
// //    });
// // });
// recordRoutes.get("/", async function (req, res) {
//   console.log("GET /record called");

//   try {
//     const db_connect = dbo.getDb();
//     // simple test query: get all documents without a filter
//     const result = await db_connect.collection("Songs").find({}).toArray();
//     console.log("DB query result count:", result.length); // just log the count
//     res.json(result);
//   } catch (err) {
//     console.error("Error in GET /record:", err);
//     res.status(500).json({ error: err.message });
//   }
// });


// // This section will help you get a single record by id
// recordRoutes.get("/:id", function (req, res) {

// //recordRoutes.route("/record/:id").get(function (req, res) {
//  let db_connect = dbo.getDb();
//  let myquery = { _id: ObjectId( req.params.id )};
//  db_connect
//      .collection("Songs")
//      .findOne(myquery, function (err, result) {
//        if (err) throw err;
//        res.json(result);
//      });
// });

// // This section will help you create a new record.
// recordRoutes.post("/add", async function (req, res) {

// // recordRoutes.post("/record/add",async function (req, res) {
//   try{
//     let db_connect = dbo.getDb();
//     let myobj = req.body;
//     const result = await db_connect.collection("Songs").insertOne(myobj)
//     if(result.acknowledged){
//       const updatedList = await db_connect.collection("Songs").find({}).toArray();
//       res.status(201).json(updatedList);
//     } else {
//       res.status(500).json({ message: "Failed to insert the document" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// recordRoutes.post("/update/:id", function (req, response) {

// // recordRoutes.route("/record/update/:id").post(function (req, response) {
//   console.log("inside update route");

//   let db_connect = dbo.getDb();
//   // let myquery = { _id: ObjectId( req.body._id )};
//   let myquery = { _id: ObjectId( req.params.id )};

//   let newvalues = {
//     $set: {
//       name: req.body.name,
//       count: req.body.count,
//     },
//   }
// console.log("update",myquery)
//   db_connect.collection("Songs").updateOne(myquery, newvalues, function (err, obj) {
//     if (err) throw err;
//   response.json(obj);
//   });
// })
// // This section will help you delete a record
// recordRoutes.delete("/:id", (req, response) => {

// // recordRoutes.route("/record/:id").delete((req, response) => {
//  let db_connect = dbo.getDb();
//  let myquery = { _id: ObjectId( req.params.id )};
//  db_connect.collection("Songs").deleteOne(myquery, function (err, obj) {
//    if (err) throw err;
//    response.json(obj);
//  });
// });


// //check for duplicate usernames
// recordRoutes.post("/signUp", (req, res) => {

// // recordRoutes.route("/signUp").post((req, res) => {
//   console.log("inside signup route");
//   console.log(req.body);
//   let db_connect = dbo.getDb();
//   let myquery = { username: req.body.username };
//   db_connect.collection("Users").findOne(myquery, function (err, result) {
//     if (err) throw err;
//     if (result) {
//       res.status(409).json({ message: "Username already exists" });
//     } else {
//       db_connect.collection("Users").insertOne(myquery, function (err, result) {
//         if (err) throw err;
//         res.status(200).json({ message: `Username ${myquery.username} created` });
//       });
//     }
//   });
// })
// recordRoutes.get("/logIn", (req, res) => {

// // recordRoutes.route("/logIn").get((req, res) => {
//   const {username} = req.query;
//   console.log("username", username);

//   let db_connect = dbo.getDb();
//   db_connect.collection("Users").findOne({username}, function (err, result) {
//     if (err) throw err;
//     if (result) {
//       res.status(200).json({ message: "Username valid" });
//     } else {
//       alert("Username not found");
//       res.status(404).json({ message: "Username not found" });
//     }
//   })
// })
// module.exports = recordRoutes;


const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

// GET all records for a given owner
recordRoutes.get("/", async (req, res) => {
  const { owner } = req.query;
  try {
    const db_connect = dbo.getDb();
    const records = await db_connect.collection("Songs").find({ owner }).toArray();
    res.json(records);
  } catch (err) {
    console.error("Error fetching records:", err);
    res.status(500).json({ error: "Failed to fetch records" });
  }
});

// GET a single record by ID
recordRoutes.get("/:id", async (req, res) => {
  try {
    const db_connect = dbo.getDb();
    const record = await db_connect
      .collection("Songs")
      .findOne({ _id: ObjectId(req.params.id) });
    if (record) {
      res.json(record);
    } else {
      res.status(404).json({ message: "Record not found" });
    }
  } catch (err) {
    console.error("Error fetching record:", err);
    res.status(500).json({ error: "Failed to fetch record" });
  }
});

// POST a new record
recordRoutes.post("/add", async (req, res) => {
  try {
    const db_connect = dbo.getDb();
    const result = await db_connect.collection("Songs").insertOne(req.body);
    if (result.acknowledged) {
      const updatedList = await db_connect.collection("Songs").find({}).toArray();
      res.status(201).json(updatedList);
    } else {
      res.status(500).json({ message: "Failed to insert the document" });
    }
  } catch (err) {
    console.error("Error adding record:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST update an existing record
recordRoutes.post("/update/:id", async (req, res) => {
  try {
    const db_connect = dbo.getDb();
    const myquery = { _id: ObjectId(req.params.id) };
    const newvalues = { $set: { name: req.body.name, count: req.body.count } };
    const result = await db_connect.collection("Songs").updateOne(myquery, newvalues);
    res.json(result);
  } catch (err) {
    console.error("Error updating record:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE a record
recordRoutes.delete("/:id", async (req, res) => {
  try {
    const db_connect = dbo.getDb();
    const result = await db_connect.collection("Songs").deleteOne({ _id: ObjectId(req.params.id) });
    res.json(result);
  } catch (err) {
    console.error("Error deleting record:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST signup (check for duplicates)
recordRoutes.post("/signUp", async (req, res) => {
  try {
    const db_connect = dbo.getDb();
    const existingUser = await db_connect.collection("Users").findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }
    await db_connect.collection("Users").insertOne({ username: req.body.username });
    res.status(200).json({ message: `Username ${req.body.username} created` });
  } catch (err) {
    console.error("Error signing up:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET login
recordRoutes.get("/logIn", async (req, res) => {
  try {
    const { username } = req.query;
    const db_connect = dbo.getDb();
    const user = await db_connect.collection("Users").findOne({ username });
    if (user) {
      res.status(200).json({ message: "Username valid" });
    } else {
      res.status(404).json({ message: "Username not found" });
    }
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = recordRoutes;

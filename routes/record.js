const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();
 
// This will help us connect to the database
const dbo = require("../db/conn");

// This helps convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;


// This section will help you get a list of all the records.
recordRoutes.route("/record").get(function (req, res) {
  const {owner} = req.query;
let db_connect = dbo.getDb();
db_connect
   .collection("Songs")
   .find({owner})
   .toArray(function (err, result) {
     if (err) throw err;
     res.json(result);
   });
});

// This section will help you get a single record by id
recordRoutes.route("/record/:id").get(function (req, res) {
 let db_connect = dbo.getDb();
 let myquery = { _id: ObjectId( req.params.id )};
 db_connect
     .collection("Songs")
     .findOne(myquery, function (err, result) {
       if (err) throw err;
       res.json(result);
     });
});

// This section will help you create a new record.
recordRoutes.post("/record/add",async function (req, res) {
  try{
    let db_connect = dbo.getDb();
    let myobj = req.body;
    const result = await db_connect.collection("Songs").insertOne(myobj)
    if(result.acknowledged){
      const updatedList = await db_connect.collection("Songs").find({}).toArray();
      res.status(201).json(updatedList);
    } else {
      res.status(500).json({ message: "Failed to insert the document" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// This section will help you update a record by id.
// recordRoutes.route("/update/:id").post(function (req, response) {
//  let db_connect = dbo.getDb("Songpicker");
//  let myquery = { _id:ObjectId(req.params.id)};
//  let newvalues = {
//      name: req.body.name,
//      count:req.body.count
//   }
//  db_connect.collection("Songs").updateOne(myquery, newvalues, function (err, obj) {
//     if (err) throw err;
//     console.log("1 document updated");
//     response.json(obj);
//   }
// );
// });
recordRoutes.route("/update/:id").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.body._id )};
  let newvalues = {
    $set: {
      name: req.body.name,
      count: req.body.count,
    },
  }

  db_connect.collection("Songs").updateOne(myquery, newvalues, function (err, obj) {
    if (err) throw err;
  response.json(obj);
  });
})
// This section will help you delete a record
recordRoutes.route("/record/:id").delete((req, response) => {
 let db_connect = dbo.getDb();
 let myquery = { _id: ObjectId( req.params.id )};
 db_connect.collection("Songs").deleteOne(myquery, function (err, obj) {
   if (err) throw err;
   response.json(obj);
 });
});


//check for duplicate usernames
recordRoutes.route("/signUp").post((req, res) => {
  console.log("inside signup route");
  console.log(req.body);
  let db_connect = dbo.getDb();
  let myquery = { username: req.body.username };
  db_connect.collection("Users").findOne(myquery, function (err, result) {
    if (err) throw err;
    if (result) {
      res.status(409).json({ message: "Username already exists" });
    } else {
      db_connect.collection("Users").insertOne(myquery, function (err, result) {
        if (err) throw err;
        res.status(200).json({ message: `Username ${myquery.username} created` });
      });
    }
  });
})

recordRoutes.route("/logIn").get((req, res) => {
  const {username} = req.query;
  console.log("username", username);

  let db_connect = dbo.getDb();
  db_connect.collection("Users").findOne({username}, function (err, result) {
    if (err) throw err;
    if (result) {
      res.status(200).json({ message: "Username valid" });
    } else {
      alert("Username not found");
      res.status(404).json({ message: "Username not found" });
    }
  })
})
module.exports = recordRoutes;

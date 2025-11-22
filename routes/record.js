const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

// GET all records for a given owner
recordRoutes.get("/", async (req, res) => {
  const { owner } = req.query;
  try {
    console.log("here I can log from the get all records for owner route")
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
    console.log("FROM the GET BY ID ROUTE")
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
        console.log("FROM the POST /ADD")

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
        console.log("FROM the UNUSED UPDATE BY ID ROUTE")

    const db_connect = dbo.getDb();
    const myquery = { _id: new ObjectId(req.params.id) };
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
        console.log("FROM the DELETE BY ID ROUTE")

    const db_connect = dbo.getDb();
    const result = await db_connect.collection("Songs").deleteOne({ _id: new ObjectId(req.params.id) });
    res.json(result);
  } catch (err) {
    console.error("Error deleting record:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST signup (check for duplicates)
recordRoutes.post("/signUp", async (req, res) => {
  try {
        console.log("FROM the SIGN UP")

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
    console.log("FROM THE LOGIN ROUTE", req)
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

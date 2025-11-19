const { MongoClient } = require("mongodb");
const Db = process.env.ATLAS_URI;

console.log("DB:", Db)

// const client = new MongoClient(Db);
const client = new MongoClient(Db);
let _db;

module.exports = {
  connectToServer: async function () {
    try{
      await client.connect() 
      _db = client.db("Songpicker"); // Assigning the database properly
      console.log("Successfully connected to MongoDB.");
    }catch(err){
      console.error("Error connecting to MongoDB:",err);
      throw(err);
    }
  },
  getDb: function () {
    if (!_db) {
      console.error("Database not initialized. Call connectToServer first.");
      return null;
    }
    return _db;
  },
};

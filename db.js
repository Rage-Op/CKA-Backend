const { MongoClient } = require("mongodb");
const atlasURI =
  "mongodb+srv://pravinyt1122334455:testing123@development.vc5a8.mongodb.net/?retryWrites=true&w=majority&appName=Development";
const localDb = "mongodb://localhost:27017/CKA-DB";

let dbConnection;

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(atlasURI)
      .then((client) => {
        console.log("database connected");
        dbConnection = client.db();
        return cb();
      })
      .catch((err) => {
        console.log(err);
        return cb(err);
      });
  },
  getDb: () => dbConnection,
};

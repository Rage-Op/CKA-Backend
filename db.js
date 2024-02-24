const { MongoClient } = require("mongodb");
const atlasURI =
  "mongodb+srv://pravinyt1122334455:9NBV4rsQuiTneW2u@cka-db.jgmfqho.mongodb.net/?retryWrites=true&w=majority&appName=CKA-DB";
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

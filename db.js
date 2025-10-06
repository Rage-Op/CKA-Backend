import { MongoClient } from "mongodb";

const atlasURI =
  "mongodb+srv://pravinyt1122334455:testing123@development.vc5a8.mongodb.net/CKA?retryWrites=true&w=majority&appName=Development";
const localDb = "mongodb://localhost:27017/CKA-DB";

let dbConnection;

export const connectToDb = (cb) => {
  MongoClient.connect(localDb)
    .then((client) => {
      console.log("database connected");
      dbConnection = client.db();
      console.log(client.db().databaseName);
      return cb();
    })
    .catch((err) => {
      console.log("db error: ", err);
      return cb(err);
    });
};

export const getDb = () => dbConnection;

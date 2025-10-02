import { MongoClient } from "mongodb";

const atlasURI =
  "mongodb+srv://pravinyt1122334455:testing123@development.vc5a8.mongodb.net/?retryWrites=true&w=majority&appName=Development";
const localDb = "mongodb://localhost:27017/CKA-DB";

let dbConnection;

export const connectToDb = (cb) => {
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
};

export const getDb = () => dbConnection;

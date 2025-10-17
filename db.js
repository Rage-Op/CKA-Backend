import { MongoClient } from "mongodb";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Set a default NODE_ENV if it's not defined
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "development";
  console.log("NODE_ENV was undefined, defaulting to:", process.env.NODE_ENV);
} else {
  console.log("NODE_ENV:", process.env.NODE_ENV);
}

let atlasURI;
if (process.env.NODE_ENV === "production") {
  // Use production database name
  atlasURI = `mongodb+srv://pravinyt1122334455:testing123@development.vc5a8.mongodb.net/PROD_CKA?retryWrites=true&w=majority&appName=Development`;
  console.log("production database connected");
} else {
  // Use development database name
  atlasURI = `mongodb+srv://pravinyt1122334455:testing123@development.vc5a8.mongodb.net/CKA?retryWrites=true&w=majority&appName=Development`;
  console.log("development database connected");
}
const localDb = "mongodb://localhost:27017/CKA-DB";

let dbConnection;

export const connectToDb = (cb) => {
  MongoClient.connect(atlasURI)
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

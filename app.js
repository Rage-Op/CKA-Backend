const express = require("express");
const { connectToDb, getDb } = require("./db");
const { ObjectId } = require("mongodb");

// init app and middleware

const app = express();
app.use(express.json());

// db connection
connectToDb((err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log("Server is up and listening on port 3000");
    });
    db = getDb();
  } else {
    console.log("connection failed");
  }
});

// routes

// search all
app.get("/students", (req, res) => {
  console.log("client connected");
  let students = [];
  db.collection("students")
    .find()
    .sort({ name: 1 })
    .forEach((student) => {
      students.push(student);
    })
    .then(() => {
      res.status(200).json(students);
    })
    .catch(() => {
      res.status(500).json({ error: "could not student data" });
    });
});

// get requests
// search one
app.get("/students/:studentId", (req, res) => {
  console.log("client requested a student's data");
  x = req.params.studentId;
  db.collection("students")
    .findOne({ studentId: x })
    .then((doc) => {
      if (doc === null) {
        res.status(400).json({ mssg: "student not found" });
      } else {
        res.status(200).json(doc);
        console.log("request fulfilled sucessfully!");
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "student not found" });
    });
});

// post requests
// add one
app.post("/students", (req, res) => {
  console.log("client is adding a student");
  const newStudent = req.body;
  db.collection("students")
    .insertOne(newStudent)
    .then((result) => {
      res.status(201).json(result);
      console.log("student added sucessfully!");
    })
    .catch((err) => {
      res.status(500).json({ error: "Could not add a new student" });
    });
});

// delete requests
// delete one
app.delete("/students/:studentId", (req, res) => {
  console.log("client is deleting a student");
  d = req.params.studentId;
  db.collection("students")
    .deleteOne({ studentId: d })
    .then((result) => {
      res.status(200).json(result);
      console.log("student deleted sucessfully!");
    })
    .catch((err) => {
      res.status(500).json({ error: "student not found" });
    });
});

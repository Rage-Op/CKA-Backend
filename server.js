import express from "express";
import { connectToDb, getDb } from "./db.js";
import { ObjectId } from "mongodb";
import bodyParser from "body-parser";
import session from "express-session";
import NepaliDate from "nepali-datetime";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config(); // Loads environment variables from a .env file into process.env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 8081;
let db;
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Middleware to log incoming requests
// const logRequests = (req, res, next) => {
//   console.log("Request URL:", req.url);
//   console.log("Request Method:", req.method);
//   console.log("Request Headers:", req.headers);
//   console.log("Request Cookies:", req.cookies);
//   next();
// };

// app.use(logRequests);

// Middleware to parse request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable session support
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60, // Cookie expires after 1 hour (in milliseconds)
    },
    rolling: true, // Reset expiry of cookie on every request
  })
);

// Middleware to check if the user is logged in
const checkLogin = (req, res, next) => {
  if (req.url.startsWith("/content")) {
    return next();
  }
  if (req.session && req.session.loggedIn) {
    next();
  } else {
    console.log("redirected to login");
    res.redirect("/");
  }
};

// Route for the login page
app.get("/", (req, res) => {
  if (req.session && req.session.loggedIn) {
    res.redirect("/index.html");
    console.log("already logged in");
  } else {
    res.sendFile(path.join(__dirname, "public", "login.html"));
  }
});

// Route to handle login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log("username: ", username);
  console.log("password: ", password);
  if (
    (username === "admin123" || username === "") &&
    (password === "password123" || password === "")
  ) {
    req.session.loggedIn = true;
    res.redirect("/index.html");
    console.log("redirected to index");
  } else {
    res.redirect("/");
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    console.log("logged out");
    if (err) {
      return res.redirect("/login.html");
    }
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
});

app.use(checkLogin);

// Example route that requires login
app.get("/dashboard", checkLogin, (req, res) => {
  res.send("Welcome to the dashboard!");
});

// db connection
connectToDb((err) => {
  if (!err) {
    // Initial Set up
    db = getDb();

    // create a collection called debit-log and create a document with a property called lastDebit and set it to "2020/00/00" if it doesn't exist already
    db.collection("debit-log")
      .find({})
      .toArray()
      .then((docs) => {
        if (docs.length === 0) {
          db.collection("debit-log").insertOne({
            lastDebit: "2020/00/00",
          });
          console.log("debit-log collection created and document inserted");
        } else {
          console.log("debit-log collection already exists");
        }

        // create a collection called settings and create a document with a document "monthlyPG", "monthlyKG", "monthlyNursery", "monthly1", "monthly2", "monthly3", "monthly4", "monthly5", "monthly6", "transport", "exam", "diet" and set them to 0 if it doesn't exist already
        // {
        //   "_id": {
        //     "$oid": "68e022588e4499c0a1c90463"
        //   },
        //   "monthlyPG": 1500,
        //   "monthlyKG": 1600,
        //   "monthlyNursery": 1700,
        //   "monthly1": 1800,
        //   "monthly2": 1900,
        //   "monthly3": 2000,
        //   "monthly4": 2100,
        //   "monthly5": 2200,
        //   "monthly6": 2300,
        //   "transport": 500,
        //   "diet": 300,
        //   "exam": 200
        // }
        db.collection("settings")
          .find({})
          .toArray()
          .then((docs) => {
            if (docs.length === 0) {
              db.collection("settings").insertOne({
                monthlyPG: 1500,
                monthlyKG: 1600,
                monthlyNursery: 1700,
                monthly1: 1800,
                monthly2: 1900,
                monthly3: 2000,
                monthly4: 2100,
                monthly5: 2200,
                monthly6: 2300,
                transport: 500,
                diet: 300,
                exam: 200,
              });
              console.log("settings collection created and document inserted");
            } else {
              console.log("settings collection already exists");
            }
          });
      });

    app.listen(PORT, () => {
      console.log(`Server is up and listening on port ${PORT}`);
    });
  } else {
    console.log("connection failed");
  }
});

// routes
// get requests
// search all => ascending order
app.get("/ascending-students", (req, res) => {
  db.collection("students")
    .find()
    .sort({ studentId: 1 }) // ascending order
    .toArray()
    .then((students) => {
      res.status(200).json(students);
    })
    .catch((err) => {
      console.error("Error fetching student data:", err);
      res.status(500).json({ error: "Could not fetch student data" });
    });
});

// search all => descendinng order
app.get("/students", (req, res) => {
  db.collection("students")
    .find()
    .sort({ studentId: -1 }) // descending order
    .toArray()
    .then((students) => {
      res.status(200).json(students);
    })
    .catch((err) => {
      console.error("Error fetching student data:", err);
      res.status(500).json({ error: "Could not fetch student data" });
    });
});

// settings
app.get("/settings", (req, res) => {
  db.collection("settings")
    .find()
    .toArray()
    .then((settings) => {
      res.status(200).json(settings);
    })
    .catch((err) => {
      console.error("Error fetching settings data:", err);
      res.status(500).json({ error: "Could not fetch settings data" });
    });
});

// debit-log
app.get("/debit-log", (req, res) => {
  db.collection("debit-log")
    .find()
    .toArray()
    .then((log) => {
      res.status(200).json(log);
    })
    .catch((err) => {
      console.error("Error fetching debit log data:", err);
      res.status(500).json({ error: "Could not fetch debit log" });
    });
});

// BS-date
app.get("/bs-date", (req, res) => {
  const bsDate = new NepaliDate();
  res.json(bsDate.toString());
});

// search one
app.get("/students/search/:studentId", (req, res) => {
  console.log("client requested a student's data");
  let x = parseInt(req.params.studentId);
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

// backup
app.get("/backup", async (req, res) => {
  try {
    console.log("backup requested");
    const students = await db.collection("students").find().toArray();
    await db.collection("backup").deleteMany({});
    await db.collection("backup").insertMany(students);
    res.status(200).json({ message: "Backup successful" });
    console.log("backup successful");
  } catch (err) {
    console.error("Error during backup:", err);
    res.status(500).json({ error: "Backup failed" });
  }
});

// post requests
// add one
app.post("/students/add", (req, res) => {
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

// patch requests
// update one
app.patch("/students/update/:studentId", (req, res) => {
  console.log("client is adding a student");
  const updates = req.body;
  let u = parseInt(req.params.studentId);
  db.collection("students")
    .updateOne({ studentId: u }, { $set: updates })
    .then((result) => {
      res.status(201).json(result);
      console.log("student data updated sucessfully!");
    })
    .catch((err) => {
      res.status(500).json({ error: "Could not update student info" });
    });
});

// update settings
app.patch("/settings", (req, res) => {
  console.log("client is updating settings");
  const updates = req.body;
  db.collection("settings")
    .findOneAndUpdate({}, { $set: updates })
    .then((result) => {
      res.status(201).json(result);
      console.log("settings updated sucessfully!");
    })
    .catch((err) => {
      res.status(500).json({ error: "Could not update settings" });
    });
});

// debit log
app.patch("/debit-log", (req, res) => {
  console.log("client is updating settings");
  const logUpdate = req.body;
  db.collection("debit-log")
    .findOneAndUpdate({}, { $set: logUpdate })
    .then((result) => {
      res.status(201).json(result);
      console.log("settings updated sucessfully!");
    })
    .catch((err) => {
      res.status(500).json({ error: "Could not update settings" });
    });
});

// fees debit
app.patch("/debit", (req, res) => {
  console.log("Client is updating debits students");
  const updates = req.body;
  Promise.all(
    updates.map((update) => {
      return db
        .collection("students")
        .findOneAndUpdate(
          { studentId: update.studentId },
          { $set: update },
          { returnOriginal: false }
        );
    })
  )
    .then((updatedDocuments) => {
      res.status(200).json(updatedDocuments);
      console.log("Students updated successfully!");
    })
    .catch((error) => {
      console.error("Error updating students:", error);
      res.status(500).json({ error: "Could not update students" });
    });
});

// delete requests
// delete one
app.delete("/students/delete/:studentId", (req, res) => {
  console.log("client is deleting a student");
  let d = parseInt(req.params.studentId);
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

// Check login before serving static files
app.use(express.static(path.join(__dirname, "public")));

// // Conditionally serve static files based on the session state
// app.get("/:filename", checkLogin, (req, res) => {
//   res.sendFile(path.join(__dirname, "public", req.params.filename));
// });

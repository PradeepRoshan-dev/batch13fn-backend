const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const task = require("./Router/Task");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/task", task);

mongoose.connect("mongodb+srv://pradeep:pradeep@cluster0.ltdgzcy.mongodb.net/?appName=Cluster0")
  .then(() => {
    console.log("Connected to MongoDB");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database connection error:", err);
  });
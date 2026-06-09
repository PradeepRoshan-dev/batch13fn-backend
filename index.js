const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const user = require("./Routes/User")
const task = require("./Router/Task");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/task", task);
app.use("/user", user);
// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB");

    // Run server only in local environment
    if (!process.env.VERCEL) {
      const PORT = process.env.PORT || 5000;

      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

// Export for Vercel
module.exports = app;

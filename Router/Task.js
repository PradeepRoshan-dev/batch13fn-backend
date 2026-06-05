const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const Task = require("../Schema/Task");
const auth = require("../auth/middleware");

// Register
router.post("/register", async (req, res) => {
  try {
    const { TaskName, Discription, StartDate, EndDate, Assignee, Password} = req.body;

    const hashedPassword = await bcrypt.hash(Password, 10);

    const task = new Task({ TaskName, Discription, StartDate, EndDate, Assignee, Password: hashedPassword});

    await task.save();

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
    
  } catch (error) {
    res.status(500).json({
      message: "Error creating task",
      error: error.message,
    });
  }
});

// Get All Tasks
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();

    res.status(200).json({
      message: "Tasks fetched successfully",
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching tasks",
      error: error.message,
    });
  }
});

// Get Task By ID
router.get("/task/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task fetched successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching task",
      error: error.message,
    });
  }
});

// Update Task
router.put("/task/:id", async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.body.Password) {
      updateData.Password = await bcrypt.hash(req.body.Password, 10);
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating task",
      error: error.message,
    });
  }
});

// Delete Task
router.delete("/task/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting task",
      error: error.message,
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { TaskName, Password } = req.body;

    const task = await Task.findOne({ TaskName });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const isMatch = await bcrypt.compare(
      Password,
      task.Password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const token = task.generateAuthToken();

    res.status(200).json({
      message: "Login successful",
      token,
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error logging in",
      error: error.message,
    });
  }
});

// Protected Route
router.get("/profile", auth, (req, res) => {
  res.status(200).json({
    message: "Protected route accessed successfully",
    user: req.user,
  });
});

module.exports = router;
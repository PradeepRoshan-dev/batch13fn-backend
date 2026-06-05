const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const taskSchema = new mongoose.Schema(
  {
    TaskName: {
      type: String,
      required: true,
    },
    Discription: {
      type: String,
      required: true,
    },
    StartDate: {
      type: Date,
      required: true,
    },
    EndDate: {
      type: Date,
      required: true,
    },
    Assignee: {
      type: [String],
      required: true,
    },
    Password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate JWT Token
taskSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      TaskName: this.TaskName,
    },
    process.env.JWT_SECRET || "mysecretkey",
    {
      expiresIn: "1h",
    }
  );
};

module.exports = mongoose.model("Task", taskSchema);
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const todoSchema = require("../Schemas/todoSchema");
const userSchema = require("../Schemas/userSchema");
const checkLogin = require("../middlewares/checkLogin");
// Create model
const Todo = new mongoose.model("Todo", todoSchema);
const User = new mongoose.model("User", userSchema);

// Get all todos
router.get("/", checkLogin, (req, res) => {
  Todo.find({}, (err, data) => {
    if (err) {
      res.status(500).json({
        error: "There was a server side error",
      });
    } else {
      res.status(200).json({
        result: data,
        message: "success",
      });
    }
  })
    .clone()
    .populate("user");
});

// Get a all todo by Id
router.get("/:id", checkLogin, (req, res) => {
  Todo.find({ _id: req.params.id }, (err, data) => {
    if (err) {
      res.status(500).json({
        error: "There was a server side error",
      });
    } else {
      res.status(200).json({
        result: data,
        message: "success",
      });
    }
  }).populate("user");
});

// POST a todo
router.post("/", checkLogin, async (req, res) => {
  const newTodo = new Todo({
    ...req.body,
    user: req.userId,
  });
  try {
    const todo = await newTodo.save();
    await User.updateOne(
      { _id: req.userId },
      {
        $push: {
          todos: todo._id,
        },
      }
    );

    res.status(200).json({
      error: "Todo inserted success",
    });
  } catch {
    (err) => {
      res.status(500).json({
        message: "There was a server side error",
      });
    };
  }
});

// POST multiple todos
router.post("/all", (req, res) => {
  Todo.insertMany(req.body, (err) => {
    if (err) {
      res.status(500).json({
        error: "There was a server side error",
      });
    } else {
      res.status(200).json({
        message: "Todo inserted success",
      });
    }
  });
});

// Update todo
router.put("/:id", (req, res) => {
  Todo.updateOne(
    { _id: req.params.id },
    {
      $set: {
        status: req.body.status,
      },
    },
    {
      new: true,
      useFindAndModify: false,
    },
    (err) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          error: "There was a server side error",
        });
      } else {
        res.status(200).json({
          message: "Todo Update success",
        });
      }
    }
  ).clone();
});

// delete a todo
router.delete("/:id", async (req, res) => {
  Todo.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        error: "There was a server side error",
      });
    } else {
      res.status(200).json({
        message: "Delete success",
      });
    }
  });
});

module.exports = router;

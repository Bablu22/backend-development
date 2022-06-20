const express = require("express");
const mongoose = require("mongoose");
const userSchema = require("../Schemas/userSchema");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = new mongoose.model("User", userSchema);

// Sign Up
router.post("/singup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      username: req.body.username,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(200).json({
      message: "Sign Up success",
    });
  } catch {
    res.status(500).json({
      message: "Sign Up faild",
    });
  }
});

// Log IN

router.post("/login", async (req, res) => {
  try {
    const user = await User.find({ username: req.body.username });

    if (user && user.length > 0) {
      const isValidPass = bcrypt.compare(req.body.password, user[0].password);
      if (isValidPass) {
        // Generate tocken
        const token = jwt.sign(
          {
            username: user[0].username,
            userId: user[0]._id,
          },
          process.env.JWT_SECRET
        );

        res.status(200).json({
          access_toke: token,
          message: "Log in success",
        });
      } else {
        res.status(401).json({
          error: "Authentication error",
        });
      }
    } else {
      res.status(401).json({
        error: "Authentication error",
      });
    }
  } catch {
    res.status(401).json({
      error: "Authentication error",
    });
  }
});

// Get users
router.get("/all", async (req, res) => {
  try {
    const users = await User.find({}).populate("todos");

    res.status(200).json({
      data: users,
      error: "success",
    });
  } catch {
    (err) => {
      res.status(500).json({
        message: "There was a server side error",
      });
    };
  }
});
module.exports = router;

const express = require("express");
const mongoose = require("mongoose");
const todoHandler = require("./routeHandler/todoHandler");
const userHandler = require("./routeHandler/userHandler");
const dotenv = require("dotenv");
const app = express();

app.use(express.json());
dotenv.config();

// connect mongoose
mongoose
  .connect("mongodb://localhost:27017/todos")
  .then(() => {
    console.log("Mongoose connect success");
  })
  .catch((err) => {
    console.log(err);
  });

// App route
app.use("/todo", todoHandler);
app.use("/user", userHandler);

// error Handler
const errorHndler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: err });
};

app.use(errorHndler);
app.get("/", (req, res) => {
  res.send("Server is runnig in port 3000");
});
app.listen(3000, () => {
  console.log("Server is Runnig");
});

const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to homework-forever application." });
});

app.listen(3000, () => {
    console.log("running.");
  });
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

require("./app/routes/todo.routes.js")(app);
// set port, listen for requests
app.listen(3000, () => {
    console.log("running.");
  });
module.exports = app => {
    const todos = require("../controllers/todo.controller.js");

    app.post("/api/todos", todos.create);
  
    app.get("/api/todos", todos.findAll);
  
    app.get("/api/todos/:todoId", todos.findOne);
  
    app.put("/api/todos/:todoId", todos.update);
  
    app.delete("/api/todos/:todoId", todos.delete);

    app.delete("/api/todos", todos.deleteAll);
  
};
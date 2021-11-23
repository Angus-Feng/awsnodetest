const Todo = require("../models/todo.model.js");

function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2)
      month = '0' + month;
  if (day.length < 2)
      day = '0' + day;

  return [year, month, day].join('-');
}

function validateTodo(todo) {
  if (!todo) {
    return "Content can not be empty.";
  }

  var expectedKeys = ['task', 'dueDate', 'status'];
  if (Object.keys(todo).sort().join(',') !== expectedKeys.sort().join(',')) {
      return "Fields must be eaxtly 'task','dueDate','status'";
  }


  if (todo.task.length < 1 || todo.task.length > 100) {
    return "Task must be between 1 and 100 characters.";
  }

  // const re = /^((((19\d{2})|(20\d{2})|2100)-(0[13578]|1[02])-(0[1-9]|[12]\d|3[01]))|(((19\d{2})|(20\d{2})|2100)-(0[13456789]|1[012])-(0[1-9]|[12]\d|30))|(((19\d{2})|(20\d{2})|2100)-02-(0[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-02-29))$/;
  // if (!re.test(todo.dueDate)) {
  //     return "Due date must be in format 1900-01-01 and the range of the year within 1900 and 2100.";
  // }

  var testDate = new Date(Date.parse(todo.dueDate));
    // accepts a string, checks whether it's a valid date
      if(isNaN(Date.parse(todo.dueDate))){
        return "Not a valid date format";
      }

    // checks if the parsed date is before the year 1900 or after 2100
      if(testDate.getFullYear() < 1900 || testDate.getFullYear() > 2100){
        return "Date out of range";
      }

  if (todo.status !== "pending" && todo.status !== "done") {
    return "status can only be either pending or done."
  }

  return true;
}

//Create a new todo
exports.create = (req, res) => {
  var valRes = validateTodo(req.body);
  if (valRes !== true) {
    res.status(400).send(JSON.stringify(valRes));
    return;
  }

  const todo = new Todo({
    task: req.body.task,
    dueDate: formatDate(req.body.dueDate),
    status: req.body.status
  });

  Todo.create(todo, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the todo."
      });
    else res.status(201).send(JSON.stringify(data.id));
  });
};

exports.findAll = (req, res) => {
  Todo.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving customers."
      });
    else res.send(data);
  });
};

exports.findOne = (req, res) => {
  Todo.findById(req.params.todoId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: "Not found todo with id " + req.params.todoId
        });
      } else {
        res.status(500).send({
          message: "Error retrieving todo with id " + req.params.todoId
        });
      }
    } else res.send(data);
  });
};

exports.update = (req, res) => {
  var valRes = validateTodo(req.body);
  if (valRes !== true) {
    res.status(400).send(JSON.stringify(valRes));
    return;
  }

  req.body.dueDate = formatDate(req.body.dueDate);

  Todo.updateById(req.params.todoId, new Todo(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found todo with id ${req.params.todoId}.`
        });
      } else {
        res.status(500).send({
          message: "Error updating todo with id " + req.params.todoId
        });
      }
    } else res.send(JSON.stringify(true));
  });
};

exports.delete = (req, res) => {
  Todo.remove(req.params.todoId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found todo with id ${req.params.todoId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete todo with id " + req.params.todoId
        });
      }
    } else res.send({ message: `Todo was deleted successfully!` });
  });
};

exports.deleteAll = (req, res) => {
  Todo.removeAll((err, data) => {
    if (err){        
      res.status(500).send({
        message:
        err.message || "Some error occurred while removing all customers."
      });
      return;
    }else res.send({ message: `All Customers were deleted successfully!` });
  });
};
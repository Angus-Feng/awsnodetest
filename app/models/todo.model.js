const sql = require("./db.js");


//Constructor
const Todo = function(todo) {
    this.task = todo.task;
    this.dueDate = todo.dueDate;
    this.status = todo.status;
};

Todo.create = (newTodo, result) => {
    sql.query("INSERT INTO todos SET ?", newTodo, (err,res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created todo: ", { id: res.insertId, ...newTodo });
        result(null, { id: res.insertId, ...newTodo });
    });
};

Todo.findById = (todoId, result) => {
    sql.query(`SELECT * FROM todos WHERE id = ${todoId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if(res.length) {
            console.log("found todo: ", res[0]);
            result(null, res[0]);
            return;
        }

        // Not found if res is empty
        result({ kind: "not_found" }, null);
    });
};

Todo.getAll = result => {
    sql.query("SELECT * FROM todos", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("todos: ", res);
        result(null, res);
    });
};

Todo.updateById = (id, todo, result) => {
    sql.query ("UPDATE todos SET task = ?, dueDate = ?, status = ? WHERE id = ?", 
        [todo.task, todo.dueDate, todo.status, id], 
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found todo with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated customer: ", { id: id, ...todo });
            result(null, { id: id, ...todo });
        }
    );
};

Todo.remove = (id, result) => {
    sql.query("DELETE FROM todos WHERE id = ?", id, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
    
        if (res.affectedRows == 0) {
          // not found todo with the id
          result({ kind: "not_found" }, null);
          return;
        }
    
        console.log("deleted todo with id: ", id);
        result(null, res);
    });
};

Todo.removeAll = result => {
    sql.query("DELETE FROM todos", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log(`deleted ${res.affectedRows} todos`);
      result(null, res);
    });
  };

module.exports = Todo;
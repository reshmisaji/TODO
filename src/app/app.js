const List = require('../todo_list');
const Item = require('../todo_item');

const { Express } = require("./express");
const app = new Express();
const fs = require("fs");

const ERROR_404 = "404: Resource Not Found";
const ERROR_500 = "500: Internal Server Error";

let todoList;
let todos = [];

const cache = {};

const filesToRead = fs.readdirSync("./public");
filesToRead.forEach(fileName => {
  const content = fs.readFileSync("./public/" + fileName);
  cache["./" + fileName] = content;
});

const readFiles = function(req, res, next) {
  todoList = fs.readFileSync("public/todolist.html");
  todos = JSON.parse(fs.readFileSync("./todos.json"));
  next();
};

const getRequestedFile = function(url) {
  const requestedFile = `.${url}`;
  return requestedFile;
};

const isFileNotFound = function(errorCode) {
  return errorCode == "ENOENT";
};

const serveFile = function(req, res) {
  const requestedFile = getRequestedFile(req.url);
  const fileContent = cache[requestedFile];
  try {
    send(res, fileContent, 200);
  } catch (err) {
    if (isFileNotFound(err.code)) {
      send(res, ERROR_404, 404);
      return;
    }
    send(res, ERROR_500, 500);
  }
};

const readBody = function(req, res, next) {
  let content = "";
  req.on("data", chunk => (content += chunk));
  req.on("end", () => {
    req.body = content;
    next();
  });
};

const readArgs = text => {
  let args = {};
  const splitKeyValue = pair => pair.split("=");
  const assignKeyValueToArgs = ([key, value]) => (args[key] = value);
  text
    .split("&")
    .map(splitKeyValue)
    .forEach(assignKeyValueToArgs);
  return args;
}

const addTodo = function(req, res) {
  const todo = readArgs(req.body);
  const item = new Item(todo.item);
  const list = new List(todo.title,[item]);
  todos.push(list);
  fs.writeFile('./todos.json',JSON.stringify(todos),()=>{});
  renderTodoList(req, res);
};

const send = function(res, data, statusCode = 200) {
  res.statusCode = statusCode;
  res.write(data);
  res.end();
};

const renderTodoList = function(req, res) {
  send(res, todoList, 200);
};

const serveTodos = function(req, res) {
  send(res, JSON.stringify(todos), 200);
};

const serveAddTodoForm = function(req, res) {
  send(res, cache["./todoForm.html"], 200);
};

app.use(readBody);
app.use(readFiles);
app.get("/todoList", renderTodoList);
app.post("/todoList", addTodo);
app.get("/todos", serveTodos);
app.get("/add?", serveAddTodoForm);
// app.post('/addTodo',addTodo);
app.use(serveFile);

const requestHandler = app.handleRequest.bind(app);
module.exports = { send, readFiles, requestHandler, todoList };
